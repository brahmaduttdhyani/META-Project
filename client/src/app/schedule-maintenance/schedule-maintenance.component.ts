
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { HttpService } from '../../services/http.service';

interface Hospital {
  id: number;
  name: string;
  location?: string;
}
interface Equipment {
  id: number;
  name: string;
  description?: string;
  hospital?: Hospital;
}
interface Maintenance {
  id: number;
  scheduledDate: string | Date;
  completedDate: string | Date; // deadline
  status: string;               // 'Initiated' | 'In Progress' | 'Serviced' ...
  description?: string;
  equipment: Equipment;
  assignedTechnicianName?: string;
}

@Component({
  selector: 'app-schedule-maintenance',
  templateUrl: './schedule-maintenance.component.html',
  styleUrls: ['./schedule-maintenance.component.scss'],
})
export class ScheduleMaintenanceComponent implements OnInit {
  itemForm: FormGroup;

  showError = false;
  errorMessage: string | null = null;
  showMessage = false;
  responseMessage: string | null = null;

  hospitalList: Hospital[] = [];
  equipmentList: Equipment[] = [];
  maintenanceList: Maintenance[] = [];

  isClick = false; // show status/cards
  private shaking = new Set<number>(); // ids currently shaking

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
    this.itemForm = this.formBuilder.group({
      scheduledDate: ['', [Validators.required, this.datePattern, this.futureDate]],
      completedDate: ['', [Validators.required, this.datePattern, this.futureDate]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      equipmentId: ['', [Validators.required, this.requiredSelect]],
      hospitalId: ['', [Validators.required, this.requiredSelect]],
    });
  }

  ngOnInit(): void {
    this.getHospital();
    this.getMaintenance();
  }

  /* -------------------- Validators -------------------- */

  // dropdown must have non-empty value
  requiredSelect = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return (v === null || v === undefined || v === '' || v === 'null') ? { required: true } : null;
  };

  // yyyy-mm-dd
  datePattern(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return { invalidDate: true };
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(val) ? null : { invalidDate: true };
  }
  

  // must be >= today (ignore time)
  futureDate(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (!v) return { invalidDate: true };
    const picked = new Date(v);
    if (Number.isNaN(picked.getTime())) return { invalidDate: true };
    const today = new Date();
    // zero time for accurate date-only compare
    picked.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return picked >= today ? null : { invalidDate: true };
  }

  /* -------------------- Data -------------------- */

  getHospital() {
    this.hospitalList = [];
    this.httpService.getHospital().subscribe(
      (data: Hospital[]) => {
        this.hospitalList = data ?? [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('getHospital error:', error);
      }
    );
  }

  onHospitalSelect(evt: Event) {
    const select = evt.target as HTMLSelectElement;
    const id = parseInt(select.value, 10);
    if (!Number.isFinite(id)) {
      this.equipmentList = [];
      return;
    }
    this.equipmentList = [];
    this.httpService.getEquipmentById(id).subscribe(
      (data: Equipment[]) => {
        this.equipmentList = data ?? [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('getEquipmentById error:', error);
      }
    );
  }

  getMaintenance() {
    this.maintenanceList = [];
    this.httpService.getScheduleMaintenance().subscribe(
      (data: Maintenance[]) => {
        const list = (data ?? []).slice();
        this.maintenanceList = this.sortMaintenance(list); // serviced at end
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error has Occured. Try again';
        console.error('getScheduleMaintenance error:', error);
      }
    );
  }

  /* -------------------- Submit -------------------- */

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.showError = false;
    this.showMessage = false;

    const payload = {
      ...this.itemForm.value,
      equipmentId: Number(this.itemForm.value.equipmentId),
      hospitalId: Number(this.itemForm.value.hospitalId),
    };

    this.httpService.scheduleMaintenance(payload, payload.equipmentId).subscribe(
      () => {
        this.itemForm.reset();
        this.itemForm.patchValue({ equipmentId: '', hospitalId: '', status: '' });
        this.showMessage = true;
        this.responseMessage = 'Saved Successfully';
        this.getMaintenance();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('scheduleMaintenance error:', error);
      }
    );
  }

  showSatus() {
    this.showMessage = false;
    this.isClick = !this.isClick;
  }

   
  onCancelMaintenance(id: number) {
  this.httpService.cancelMaintenance(id).subscribe(
    () => {
      this.showMessage = true;
      this.responseMessage = 'Maintenance cancelled successfully';
      this.getMaintenance(); // Refresh list
    },
    (error) => {
      this.showError = true;
      this.errorMessage = 'Failed to cancel maintenance. Please try again later.';
      console.error('cancelMaintenance error:', error);
    }
  );
}
isCancelable(status: string | null | undefined): boolean {
  const s = (status || '').toLowerCase();

  // hide cancel button once cancelled / in progress / serviced
  if (s.includes('cancel') || s.includes('progress') || s.includes('serviced')) return false;

  return true; // Initiated etc.
}



  /* -------------------- Sorting -------------------- */

  /** Ensure 'Serviced' items are last, others by scheduledDate asc, then id */
  private sortMaintenance(list: Maintenance[]): Maintenance[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('serviced') || v.includes('completed')) return 2; // last
      if (v.includes('progress')) return 1; // middle
      return 0; // first (initiated/pending/scheduled)
    };

    return list.sort((a, b) => {
      const ra = rank(a.status);
      const rb = rank(b.status);
      if (ra !== rb) return ra - rb;

      const da = new Date(a.scheduledDate).getTime();
      const db = new Date(b.scheduledDate).getTime();
      if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return da - db;

      return (a.id ?? 0) - (b.id ?? 0);
    });
  }

  /* -------------------- Shake animation helpers -------------------- */

  shakeCard(id: number) {
    if (this.shaking.has(id)) {
      // restart animation on rapid taps
      this.shaking.delete(id);
      setTimeout(() => this.shaking.add(id), 0);
    } else {
      this.shaking.add(id);
    }
  }

  onAnimationEnd(id: number, ev: AnimationEvent) {
    if (ev.animationName !== 'shakeCard') return;
    this.shaking.delete(id);
  }

  isShaking(id: number): boolean {
    return this.shaking.has(id);
  }

  /* -------------------- UI helpers -------------------- */

  trackByMaintId(_i: number, item: Maintenance) {
    return item?.id;
  }

  isServiced(status: string | undefined | null): boolean {
    const s = (status || '').toLowerCase();
    return s.includes('serviced') || s.includes('completed');
  }

  statusClass(status: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('serviced') || s.includes('completed')) return 'status-serviced';
    if (s.includes('progress')) return 'status-progress';
    return 'status-pending';
  }

  cardToneClass(index: number): string {
    // Cycle tones to subtly differentiate cards (shadow hue)
    const tone = (index % 3) + 1; // 1..3
    return `tone-${tone}`;
  }

  /* -------------------- Buttons (demo handlers) -------------------- */

  onDetails(m: Maintenance) {
    console.log('Schedule details clicked:', m);
    // TODO: open details drawer/modal
  }

  onTrack(m: Maintenance) {
    console.log('Track schedule clicked:', m);
    // TODO: open track timeline/modal
  }
}