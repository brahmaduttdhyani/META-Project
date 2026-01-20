
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // 👈 add

interface Hospital {
  id: number;
  name: string;
  location?: string | null;   // free-form address (e.g., "Apollo, Chennai")
  lat?: number | null;        // optional precise coordinates
  lng?: number | null;
}
interface Equipment {
  id: number;
  name: string;
  description?: string | null;
  hospital?: Hospital | null;
}
interface Maintenance {
  id: number;
  scheduledDate: string | Date;
  completedDate: string | Date;
  status: string;                        // 'PENDING' | 'In Progress' | 'Serviced' ...
  requestStatus?: string | null;         // 'PENDING' | 'ACCEPTED' | 'REJECTED' ...
  description?: string | null;
  equipment?: Equipment | null;
  assignedTechnicianId?: number | null;
  assignedTechnicianName?: string | null;
}

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit {
  formModel: any = { status: null };

  showError = false;
  errorMessage: string | null = null;

  itemForm: FormGroup;
  maintenanceList: Maintenance[] = [];

  showMessage = false;
  responseMessage = '';

  currentTechId = 0;

  // Local (per-user) rejected ids
  rejectedIds: number[] = [];

  // Shake + Map state
  private shaking = new Set<number>();
  private openMaps = new Set<number>();                       // 👈 track which cards show map
  private mapCache = new Map<number, SafeResourceUrl>();      // 👈 memoize sanitizer results

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sanitizer: DomSanitizer            // 👈 inject
  ) {
    // Guard: only hospital/technician
    if (authService.getRole != 'HOSPITAL' && authService.getRole != 'TECHNICIAN') {
      this.router.navigateByUrl('dashboard');
    }

    this.itemForm = this.formBuilder.group({
      scheduledDate: [this.formModel.scheduledDate, [Validators.required, this.dateValidator]],
      completedDate: [this.formModel.completedDate, [Validators.required, this.dateValidator]],
      description: [this.formModel.description, [Validators.required]],
      status: [this.formModel.status, [Validators.required]],
      maintenanceId: [this.formModel.maintenanceId],
    });
  }

  ngOnInit(): void {
    const rawId = localStorage.getItem('userId');
    this.currentTechId = rawId ? parseInt(rawId, 10) : 0;

    this.loadRejected();
    this.getMaintenance();
  }

  /* -------------------- Validators -------------------- */

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }

  /* -------------------- Data -------------------- */

  getMaintenance() {
    this.maintenanceList = [];
    this.httpService.getMaintenance().subscribe(
      (data: Maintenance[]) => {
        const list = (data ?? []).slice();
        this.maintenanceList = this.sortMaintenance(list); // serviced last
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error has Occured. Try again';
        console.error('Maintenance error:', error);
      }
    );
  }

  /** Ensure 'Serviced' items are last, others by scheduledDate asc, then id */
  private sortMaintenance(list: Maintenance[]): Maintenance[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('serviced') || v.includes('completed')) return 2; // last
      if (v.includes('progress')) return 1; // middle
      return 0; // first (initiated/pending)
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

  /* -------------------- Actions -------------------- */

  accept(maintenanceId: number) {
    this.httpService.respondMaintenance(maintenanceId, 'ACCEPT').subscribe(
      () => this.getMaintenance(),
      (error) => {
        this.showError = true;
        this.errorMessage = error?.error?.message || 'Failed to accept';
        console.error('Accept error:', error);
      }
    );
  }

  // Local reject only (hide on UI for current user)
  private rejectedKey(): string {
    const uname = (localStorage.getItem('username') || 'unknown').toLowerCase();
    return `rejectedMaint_${uname}`;
  }

  loadRejected() {
    const raw = localStorage.getItem(this.rejectedKey());
    this.rejectedIds = raw ? JSON.parse(raw) : [];
  }

  isRejected(id: number): boolean {
    return this.rejectedIds.includes(id);
  }

  rejectLocally(id: number) {
    if (!this.rejectedIds.includes(id)) {
      this.rejectedIds.push(id);
      localStorage.setItem(this.rejectedKey(), JSON.stringify(this.rejectedIds));
    }
  }

  canEdit(m: Maintenance): boolean {
    return (
      (m.requestStatus?.toUpperCase() === 'ACCEPTED') &&
      (Number(m.assignedTechnicianId) === this.currentTechId) &&
      (m.status !== 'Serviced')
    );
  }

  edit(val: Maintenance) {
    const scheduledDate = new Date(val.scheduledDate);
    const completedDate = new Date(val.completedDate);

    this.itemForm.patchValue({
      scheduledDate: scheduledDate.toISOString().substring(0, 10),
      completedDate: completedDate.toISOString().substring(0, 10),
      description: val.description ?? '',
      status: val.status,
      maintenanceId: val.id,
    });
  }

  update() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.showError = false;
    this.httpService
      .updateMaintenance(this.itemForm.value, this.itemForm.controls['maintenanceId'].value)
      .subscribe(
        () => {
          this.itemForm.reset();
          this.showMessage = true;
          this.responseMessage = 'Updated successfully';
          this.getMaintenance();
        },
        (error) => {
          this.showError = true;
          this.errorMessage = error?.error?.message || 'Update failed';
          console.error('Update error:', error);
        }
      );
  }

  /* -------------------- Map integration (DomSanitizer) -------------------- */

  /** Has minimum info to build a map (coords or a location string) */
  hasHospitalInfo(m: Maintenance): boolean {
    const hosp = m.equipment?.hospital;
    if (!hosp) return false;
    return (typeof hosp.lat === 'number' && typeof hosp.lng === 'number') || !!hosp.location;
  }

  /** Toggle map display per card */
  toggleMap(id: number) {
    if (this.openMaps.has(id)) this.openMaps.delete(id);
    else this.openMaps.add(id);
  }

  isMapOpen(id: number): boolean {
    return this.openMaps.has(id);
  }

  /**
   * Build a SafeResourceUrl for <iframe [src]> using DomSanitizer.
   * - Uses lat/lng if present; otherwise falls back to a search query by hospital name/location.
   * - Uses Google Maps embed (no API key required for simple embeds).
   */
  getMapUrl(m: Maintenance): SafeResourceUrl {
    const cache = this.mapCache.get(m.id);
    if (cache) return cache;

    const hosp = m.equipment?.hospital;
    let url = 'about:blank';

    if (hosp?.lat != null && hosp?.lng != null) {
      // precise coordinates
      url = `https://www.google.com/maps?q=${hosp.lat},${hosp.lng}&z=14&output=embed`;
    } else {
      // build a search query with the best available info
      const parts: string[] = [];
      if (hosp?.name) parts.push(hosp.name);
      if (hosp?.location) parts.push(hosp.location);
      const q = encodeURIComponent(parts.join(', ').trim());
      url = `https://www.google.com/maps?q=${q}&z=14&output=embed`;
    }

    const safe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.mapCache.set(m.id, safe);
    return safe;
  }

  /* -------------------- Shake animation helpers -------------------- */

  shakeCard(id: number) {
    // Restart animation on rapid taps
    if (this.shaking.has(id)) {
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
    return 'status-initiated';
  }

  // (Legacy helper if still needed somewhere)
  getStatusStyle(status: string) {
    if (status === 'Serviced') {
      return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
    } else if (status === 'In Progress') {
      return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
    } else {
      return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
    }
  }

  cardToneClass(index: number): string {
    const tone = (index % 3) + 1; // 1..3
    return `tone-${tone}`;
  }
}
