
import { Component, OnInit } from '@angular/core';
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
  status: string;               // 'Serviced' | 'In Progress' | 'Initiated' | ...
  equipment: Equipment;
  assignedTechnicianName?: string;
}

@Component({
  selector: 'app-maintenance-status',
  templateUrl: './maintenance-status.component.html',
  styleUrls: ['./maintenance-status.component.scss'],
})
export class MaintenanceStatusComponent implements OnInit {
  maintenanceList: Maintenance[] = [];
  showError = false;
  errorMessage: string | null = null;

  /** Toggle state for cards (id → toggled on touch) */
  private toggled = new Set<number>();

  /** Debounce for touch toggles (avoid double-fires) */
  private lastToggleAt = 0;
  private readonly toggleDebounceMs = 120;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getMaintenance();
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
        console.error('error:', error);
      }
    );
  }

  /** Ensure 'Serviced' items are last, others by scheduledDate asc, then id */
  private sortMaintenance(list: Maintenance[]): Maintenance[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('cancel')) return 3;
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

  /* ------------ Touch-only smooth toggle via Pointer Events ------------ */

  onPointerToggle(m: Maintenance, ev: PointerEvent) {
    // Only toggle on real touch (ignore mouse/pen)
    if (ev.pointerType !== 'touch') return;
    if (this.isServiced(m.status)) return;

    // Debounce to avoid double-fires
    const now = Date.now();
    if (now - this.lastToggleAt < this.toggleDebounceMs) return;
    this.lastToggleAt = now;

    // Optional: prevent mouse compatibility clicks on some browsers
    ev.preventDefault?.();
    ev.stopPropagation?.();

    if (this.toggled.has(m.id)) {
      this.toggled.delete(m.id);
    } else {
      this.toggled.add(m.id);
    }
  }

  isToggled(id: number): boolean {
    return this.toggled.has(id);
  }

  /* ------------ UI helpers ------------ */

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
    const tone = (index % 3) + 1; // 1..3
    return `tone-${tone}`;
  }

  /* ------------ (Optional) actions ------------ */

  onDetails(m: Maintenance) {
    console.log('Maintenance details clicked:', m);
  }

  onTrack(m: Maintenance) {
    console.log('Track maintenance clicked:', m);
  }
}
