

// import { Component, OnInit } from '@angular/core';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormGroup,
//   ValidationErrors,
//   Validators,
// } from '@angular/forms';
// import { HttpService } from '../../services/http.service';

// interface Hospital {
//   id: number;
//   name: string;
//   location?: string;
// }
// interface Equipment {
//   id: number;
//   name: string;
//   description?: string;
//   hospital?: Hospital;
// }
// interface Maintenance {
//   id: number;
//   scheduledDate: string | Date;
//   completedDate: string | Date; // deadline
//   status: string;               // 'Initiated' | 'In Progress' | 'Serviced' ...
//   description?: string;
//   equipment: Equipment;
//   assignedTechnicianName?: string;
// }

// @Component({
//   selector: 'app-schedule-maintenance',
//   templateUrl: './schedule-maintenance.component.html',
//   styleUrls: ['./schedule-maintenance.component.scss'],
// })
// export class ScheduleMaintenanceComponent implements OnInit {
//   itemForm: FormGroup;

//   showError = false;
//   errorMessage: string | null = null;
//   showMessage = false;
//   responseMessage: string | null = null;

//   hospitalList: Hospital[] = [];
//   equipmentList: Equipment[] = [];
//   maintenanceList: Maintenance[] = [];

//   isClick = false; // show status/cards
//   private shaking = new Set<number>(); // ids currently shaking

//   constructor(
//     private formBuilder: FormBuilder,
//     private httpService: HttpService
//   ) {
//     this.itemForm = this.formBuilder.group(
//   {
//     scheduledDate: ['', [Validators.required, this.datePattern, this.futureDate]],
//     completedDate: ['', [Validators.required, this.datePattern, this.futureDate]],
//     description: ['', [Validators.required]],
//     status: ['', [Validators.required]],
//     equipmentId: ['', [Validators.required, this.requiredSelect]],
//     hospitalId: ['', [Validators.required, this.requiredSelect]],
//   },
//   { validators: [this.dateRangeValidator] } // ✅ ADD THIS LINE
// );
 
//   }

//   ngOnInit(): void {
//     this.getHospital();
//     this.getMaintenance();
//   }

//   /* -------------------- Validators -------------------- */

//   // dropdown must have non-empty value
//   requiredSelect = (control: AbstractControl): ValidationErrors | null => {
//     const v = control.value;
//     return (v === null || v === undefined || v === '' || v === 'null') ? { required: true } : null;
//   };

//   // yyyy-mm-dd
//   datePattern(control: AbstractControl): ValidationErrors | null {
//     const val = control.value;
//     if (!val) return { invalidDate: true };
//     const re = /^\d{4}-\d{2}-\d{2}$/;
//     return re.test(val) ? null : { invalidDate: true };
//   }

//   dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
//   const scheduled = group.get('scheduledDate')?.value;
//   const completed = group.get('completedDate')?.value;
 
//   if (!scheduled || !completed) return null;
 
//   const s = new Date(scheduled);
//   const c = new Date(completed);
 
//   if (Number.isNaN(s.getTime()) || Number.isNaN(c.getTime())) return null;
 
//   s.setHours(0, 0, 0, 0);
//   c.setHours(0, 0, 0, 0);
 
//   return c >= s ? null : { dateRange: true };
// };
  

//   // must be >= today (ignore time)
//   futureDate(control: AbstractControl): ValidationErrors | null {
//     const v = control.value;
//     if (!v) return { invalidDate: true };
//     const picked = new Date(v);
//     if (Number.isNaN(picked.getTime())) return { invalidDate: true };
//     const today = new Date();
//     // zero time for accurate date-only compare
//     picked.setHours(0, 0, 0, 0);
//     today.setHours(0, 0, 0, 0);
//     return picked >= today ? null : { invalidDate: true };
//   }

//   /* -------------------- Data -------------------- */

//   getHospital() {
//     this.hospitalList = [];
//     this.httpService.getHospital().subscribe(
//       (data: Hospital[]) => {
//         this.hospitalList = data ?? [];
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage = 'An error occurred. Please try again later.';
//         console.error('getHospital error:', error);
//       }
//     );
//   }

//   onHospitalSelect(evt: Event) {
//     const select = evt.target as HTMLSelectElement;
//     const id = parseInt(select.value, 10);
//     if (!Number.isFinite(id)) {
//       this.equipmentList = [];
//       return;
//     }
//     this.equipmentList = [];
//     this.httpService.getEquipmentById(id).subscribe(
//       (data: Equipment[]) => {
//         this.equipmentList = data ?? [];
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage = 'An error occurred. Please try again later.';
//         console.error('getEquipmentById error:', error);
//       }
//     );
//   }

//   getMaintenance() {
//     this.maintenanceList = [];
//     this.httpService.getScheduleMaintenance().subscribe(
//       (data: Maintenance[]) => {
//         const list = (data ?? []).slice();
//         this.maintenanceList = this.sortMaintenance(list); // serviced at end
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage = 'An error has Occured. Try again';
//         console.error('getScheduleMaintenance error:', error);
//       }
//     );
//   }

//   /* -------------------- Submit -------------------- */

//   onSubmit() {
//     if (this.itemForm.invalid) {
//       this.itemForm.markAllAsTouched();
//       return;
//     }

//     this.showError = false;
//     this.showMessage = false;

//     const payload = {
//       ...this.itemForm.value,
//       equipmentId: Number(this.itemForm.value.equipmentId),
//       hospitalId: Number(this.itemForm.value.hospitalId),
//     };

//     this.httpService.scheduleMaintenance(payload, payload.equipmentId).subscribe(
//       () => {
//         this.itemForm.reset();
//         this.itemForm.patchValue({ equipmentId: '', hospitalId: '', status: '' });
//         this.showMessage = true;
//         this.responseMessage = 'Saved Successfully';
//         this.getMaintenance();
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage = 'An error occurred. Please try again later.';
//         console.error('scheduleMaintenance error:', error);
//       }
//     );
//   }

//   showSatus() {
//     this.showMessage = false;
//     this.isClick = !this.isClick;
//   }

   
//   onCancelMaintenance(id: number) {
//   this.httpService.cancelMaintenance(id).subscribe(
//     () => {
//       this.showMessage = true;
//       this.responseMessage = 'Maintenance cancelled successfully';
//       this.getMaintenance(); // Refresh list
//     },
//     (error) => {
//       this.showError = true;
//       this.errorMessage = 'Failed to cancel maintenance. Please try again later.';
//       console.error('cancelMaintenance error:', error);
//     }
//   );
// }
// isCancelable(status: string | null | undefined): boolean {
//   const s = (status || '').toLowerCase();

//   // hide cancel button once cancelled / in progress / serviced
//   if (s.includes('cancel') || s.includes('progress') || s.includes('serviced')) return false;

//   return true; // Initiated etc.
// }



//   /* -------------------- Sorting -------------------- */

//   /** Ensure 'Serviced' items are last, others by scheduledDate asc, then id */
//   private sortMaintenance(list: Maintenance[]): Maintenance[] {
//     const rank = (s = '') => {
//       const v = s.toLowerCase();
//       if (v.includes('serviced') || v.includes('completed')) return 2; // last
//       if (v.includes('progress')) return 1; // middle
//       return 0; // first (initiated/pending/scheduled)
//     };

//     return list.sort((a, b) => {
//       const ra = rank(a.status);
//       const rb = rank(b.status);
//       if (ra !== rb) return ra - rb;

//       const da = new Date(a.scheduledDate).getTime();
//       const db = new Date(b.scheduledDate).getTime();
//       if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return da - db;

//       return (a.id ?? 0) - (b.id ?? 0);
//     });
//   }

//   /* -------------------- Shake animation helpers -------------------- */

//   shakeCard(id: number) {
//     if (this.shaking.has(id)) {
//       // restart animation on rapid taps
//       this.shaking.delete(id);
//       setTimeout(() => this.shaking.add(id), 0);
//     } else {
//       this.shaking.add(id);
//     }
//   }

//   onAnimationEnd(id: number, ev: AnimationEvent) {
//     if (ev.animationName !== 'shakeCard') return;
//     this.shaking.delete(id);
//   }

//   isShaking(id: number): boolean {
//     return this.shaking.has(id);
//   }

//   /* -------------------- UI helpers -------------------- */

//   trackByMaintId(_i: number, item: Maintenance) {
//     return item?.id;
//   }

//   isServiced(status: string | undefined | null): boolean {
//     const s = (status || '').toLowerCase();
//     return s.includes('serviced') || s.includes('completed');
//   }

//   statusClass(status: string) {
//     const s = (status || '').toLowerCase();
//     if (s.includes('serviced') || s.includes('completed')) return 'status-serviced';
//     if (s.includes('progress')) return 'status-progress';
//     return 'status-pending';
//   }

//   cardToneClass(index: number): string {
//     // Cycle tones to subtly differentiate cards (shadow hue)
//     const tone = (index % 3) + 1; // 1..3
//     return `tone-${tone}`;
//   }

//   /* -------------------- Buttons (demo handlers) -------------------- */

//   onDetails(m: Maintenance) {
//     console.log('Schedule details clicked:', m);
//     // TODO: open details drawer/modal
//   }

//   onTrack(m: Maintenance) {
//     console.log('Track schedule clicked:', m);
//     // TODO: open track timeline/modal
//   }
// }




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
  completedDate: string | Date;
  status: string;
  description?: string;

  // Keep nullable to avoid optional chain warnings in template
  equipment?: Equipment | null;

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

  /** show/hide cards panel */
  isClick = false;

  /** per-card shake animation trigger */
  private shaking = new Set<number>();

  /**
   * Per-card expanded/collapsed details (for “Show details / Hide details” UI)
   * - if an id is in this set => details are visible
   */
  private expanded = new Set<number>();

  /**
   * Holds current ring dashoffset per maintenance ID.
   * We keep it stable so each card shows its own correct progress.
   */
  private ringOffset = new Map<number, number>();

  constructor(private formBuilder: FormBuilder, private httpService: HttpService) {
    this.itemForm = this.formBuilder.group(
      {
        scheduledDate: ['', [Validators.required, this.datePattern, this.futureDate]],
        completedDate: ['', [Validators.required, this.datePattern, this.futureDate]],
        description: ['', [Validators.required]],
        status: ['', [Validators.required]],
        equipmentId: ['', [Validators.required, this.requiredSelect]],
        hospitalId: ['', [Validators.required, this.requiredSelect]],
      },
      {
        validators: [this.deadlineAfterScheduledValidator],
      }
    );
  }

  ngOnInit(): void {
    this.getHospital();
    this.getMaintenance();
  }

  /* -------------------- trackBy -------------------- */
  trackByHospitalId = (_i: number, hos: Hospital) => hos?.id;
  trackByEquipmentId = (_i: number, eq: Equipment) => eq?.id;
  trackByMaintId = (_i: number, m: Maintenance) => m?.id;

  /* -------------------- Validators -------------------- */
  requiredSelect = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return v === null || v === undefined || v === '' || v === 'null' ? { required: true } : null;
  };

  datePattern(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return { invalidDate: true };
    const re = /^\d{4}-\d{2}-\d{2}$/;
    return re.test(val) ? null : { invalidDate: true };
  }

  futureDate(control: AbstractControl): ValidationErrors | null {
    const v = control.value;
    if (!v) return { invalidDate: true };

    const picked = new Date(v);
    if (Number.isNaN(picked.getTime())) return { invalidDate: true };

    const today = new Date();
    picked.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return picked >= today ? null : { invalidDate: true };
  }

  /** ✅ Form-level validator: Deadline must be >= Scheduled */
  deadlineAfterScheduledValidator = (group: AbstractControl): ValidationErrors | null => {
    const scheduled = group.get('scheduledDate')?.value;
    const deadline = group.get('completedDate')?.value;
    if (!scheduled || !deadline) return null;

    const s = new Date(scheduled);
    const d = new Date(deadline);
    if (Number.isNaN(s.getTime()) || Number.isNaN(d.getTime())) return null;

    s.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    return d >= s ? null : { deadlineBeforeScheduled: true };
  };

  /* -------------------- Data -------------------- */
  getHospital() {
    this.showError = false;
    this.errorMessage = null;

    this.httpService.getHospital().subscribe(
      (data: Hospital[]) => {
        this.hospitalList = data ?? [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        // eslint-disable-next-line no-console
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

    this.showError = false;
    this.errorMessage = null;

    this.equipmentList = [];
    this.httpService.getEquipmentById(id).subscribe(
      (data: Equipment[]) => {
        this.equipmentList = data ?? [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        // eslint-disable-next-line no-console
        console.error('getEquipmentById error:', error);
      }
    );
  }

  getMaintenance() {
    this.showError = false;
    this.errorMessage = null;

    this.httpService.getScheduleMaintenance().subscribe(
      (data: Maintenance[]) => {
        const list = (data ?? []).slice();
        this.maintenanceList = this.sortMaintenance(list);

        // Keep expanded state for existing cards only
        this.cleanupExpanded();

        // Ensure rings update correctly whenever list refreshes
        this.prepareRingAnimation(true);
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error has occurred. Try again';
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.error('scheduleMaintenance error:', error);
      }
    );
  }

  /** Toggle the whole cards panel (Show Status / Hide Status) */
  showStatus() {
    this.showMessage = false;
    this.isClick = !this.isClick;

    // When opening, prime rings (and keep existing expanded states)
    if (this.isClick) {
      this.prepareRingAnimation(false);
    }
  }

  /** Backward compatible (your template currently calls showSatus()) */
  showSatus() {
    this.showStatus();
  }

  onCancelMaintenance(id: number) {
    this.httpService.cancelMaintenance(id).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = 'Maintenance cancelled successfully';
        this.getMaintenance();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'Failed to cancel maintenance. Please try again later.';
        // eslint-disable-next-line no-console
        console.error('cancelMaintenance error:', error);
      }
    );
  }

  /* -------------------- Per-card details (Show/Hide details) -------------------- */
  toggleDetails(id: number) {
    if (this.expanded.has(id)) this.expanded.delete(id);
    else this.expanded.add(id);
  }

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  /** optional helper if you want “collapse all” button later */
  collapseAllDetails() {
    this.expanded.clear();
  }

  private cleanupExpanded() {
    const liveIds = new Set<number>((this.maintenanceList ?? []).map((m) => m.id));
    for (const id of this.expanded) {
      if (!liveIds.has(id)) this.expanded.delete(id);
    }
  }

  /* -------------------- Status helpers -------------------- */
  private isCancelled(status: string | undefined | null): boolean {
    const s = (status || '').toLowerCase();
    return s.includes('cancel');
  }

  isServiced(status: string | undefined | null): boolean {
    const s = (status || '').toLowerCase();
    return s.includes('serviced') || s.includes('completed') || s.includes('delivered');
  }

  isCancelable(status: string | null | undefined): boolean {
    const s = (status || '').toLowerCase();
    // Not cancelable if cancelled, in-progress, serviced/completed
    if (s.includes('cancel') || s.includes('progress') || s.includes('serviced') || s.includes('completed') || s.includes('delivered')) {
      return false;
    }
    return true;
  }

  statusClass(status: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('cancel')) return 'status-cancelled';
    if (s.includes('serviced') || s.includes('completed') || s.includes('delivered')) return 'status-serviced';
    if (s.includes('progress')) return 'status-progress';
    return 'status-pending'; // initiated etc.
  }

  borderClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('cancel')) return 'border-cancelled';
    if (s.includes('serviced') || s.includes('completed') || s.includes('delivered')) return 'border-serviced';
    if (s.includes('progress')) return 'border-progress';
    return 'border-initiated';
  }

  statusIcon(status: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('cancel')) return '⛔';
    if (s.includes('serviced') || s.includes('completed') || s.includes('delivered')) return '✔';
    if (s.includes('progress')) return '🚧';
    return '🕒';
  }

  /* -------------------- Sorting -------------------- */
  private sortMaintenance(list: Maintenance[]): Maintenance[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      // Initiated first, then in-progress, then serviced, cancelled last
      if (v.includes('cancel')) return 3;
      if (v.includes('serviced') || v.includes('completed') || v.includes('delivered')) return 2;
      if (v.includes('progress')) return 1;
      return 0;
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

  /* -------------------- Shake helpers -------------------- */
  shakeCard(id: number) {
    if (this.shaking.has(id)) {
      this.shaking.delete(id);
      setTimeout(() => this.shaking.add(id), 0);
    } else {
      this.shaking.add(id);
    }
  }

  onAnimationEnd(id: number, ev: AnimationEvent) {
    if ((ev as any).animationName !== 'shakeCard') return;
    this.shaking.delete(id);
  }

  isShaking(id: number): boolean {
    return this.shaking.has(id);
  }

  /* -------------------- Progress Ring -------------------- */
  /**
   * Progress based on today between scheduled and deadline (0..100).
   * Cancelled can either freeze, or keep showing time progress.
   * Here we freeze at 0.
   */
  progressPercent(m: Maintenance): number {
    const parse = (d: string | Date | undefined | null) => {
      if (!d) return null;
      const x = d instanceof Date ? d : new Date(d as any);
      return Number.isNaN(x.getTime()) ? null : x;
    };

    const start = parse(m.scheduledDate);
    const end = parse(m.completedDate);

    if (this.isCancelled(m.status)) return 0;
    if (this.isServiced(m.status)) return 100;

    if (start && end && end.getTime() > start.getTime()) {
      const s = new Date(start); s.setHours(0, 0, 0, 0);
      const e = new Date(end);   e.setHours(0, 0, 0, 0);
      const n = new Date();      n.setHours(0, 0, 0, 0);

      const total = e.getTime() - s.getTime();
      const done = Math.min(Math.max(n.getTime() - s.getTime(), 0), total);
      const pct = Math.round((done / total) * 100);

      return Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0));
    }

    // fallback if dates missing
    const sKey = (m.status || '').toLowerCase();
    if (sKey.includes('progress')) return 65;
    return 25; // initiated etc.
  }

  private targetOffset(m: Maintenance): number {
    return 100 - this.progressPercent(m);
  }

  /** Template binding uses this */
  getRingOffset(m: Maintenance): number {
    const id = m.id ?? -1;

    // If not in map yet, initialize at 100 then animate to target.
    const cur = this.ringOffset.get(id);
    if (typeof cur !== 'number') {
      const target = this.targetOffset(m);
      this.ringOffset.set(id, 100);
      setTimeout(() => this.ringOffset.set(id, target), 50);
      return 100;
    }

    return cur;
  }

  /**
   * Prepares ring offsets for all cards.
   * - If forceReset=true, reset to 100 then animate to new values (fresh animation).
   * - Otherwise, just update differences smoothly.
   */
  private prepareRingAnimation(forceReset: boolean) {
    const seen = new Set<number>();

    for (const m of this.maintenanceList) {
      const id = m.id ?? -1;
      seen.add(id);

      const target = this.targetOffset(m);

      if (forceReset) {
        this.ringOffset.set(id, 100);
        setTimeout(() => this.ringOffset.set(id, target), 80);
      } else {
        const cur = this.ringOffset.get(id);
        if (typeof cur !== 'number') {
          this.ringOffset.set(id, 100);
          setTimeout(() => this.ringOffset.set(id, target), 80);
        } else if (cur !== target) {
          setTimeout(() => this.ringOffset.set(id, target), 0);
        }
      }
    }

    // cleanup stale ids
    for (const key of this.ringOffset.keys()) {
      if (!seen.has(key)) this.ringOffset.delete(key);
    }
  }

  /* -------------------- Deadline helpers -------------------- */
  private daysRemaining(deadline: string | Date | undefined | null): number | null {
    if (!deadline) return null;
    const d = new Date(deadline);
    if (Number.isNaN(d.getTime())) return null;

    const today = new Date();
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  deadlineLabel(deadline: string | Date | undefined | null): string {
    const n = this.daysRemaining(deadline);
    if (n === null) return '—';
    if (n > 3) return `${n} days left`;
    if (n > 0) return `${n} day${n > 1 ? 's' : ''} left`;
    if (n === 0) return 'Due today';
    return `${Math.abs(n)} day${Math.abs(n) > 1 ? 's' : ''} overdue`;
  }

  deadlineToneClass(deadline: string | Date | undefined | null): string {
    const n = this.daysRemaining(deadline);
    if (n === null) return 'deadline-ontrack';
    if (n > 3) return 'deadline-ontrack';
    if (n > 0) return 'deadline-soon';
    if (n === 0) return 'deadline-due';
    return 'deadline-overdue';
  }
}

