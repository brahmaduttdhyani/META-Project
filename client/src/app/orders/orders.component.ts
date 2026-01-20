
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Hospital {
  id: number;
  name: string;
  location?: string | null;
  lat?: number | null;
  lng?: number | null;
}
interface Equipment {
  id: number;
  name: string;
  description?: string | null;
  hospital?: Hospital | null;
}
interface Order {
  id: number;
  orderDate: string | Date;
  quantity: number;
  status: string;                    // 'Initiated' | 'In Transit' | 'Delivered'...
  requestStatus?: string | null;     // 'PENDING' | 'ACCEPTED' | 'REJECTED'
  equipment?: Equipment | null;
  assignedSupplierId?: number | null;
  assignedSupplierName?: string | null;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  showError = false;
  errorMessage: string | null = null;

  showMessage = false;
  responseMessage: string | null = null;

  orderList: Order[] = [];
  statusModel: { newStatus: string | null; orderId?: number } = { newStatus: null };

  currentSupplierId = 0;

  // Local reject storage
  rejectedOrderIds: number[] = [];

  // UI state: shake + map
  private shaking = new Set<number>();
  private openMaps = new Set<number>();
  private mapCache = new Map<number, SafeResourceUrl>();

  constructor(
    public router: Router,
    public httpService: HttpService,
    public authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    if (authService.getRole != 'HOSPITAL' && authService.getRole != 'SUPPLIER') {
      this.router.navigateByUrl('dashboard');
    }
  }

  ngOnInit(): void {
    const rawId = localStorage.getItem('userId');
    this.currentSupplierId = rawId ? parseInt(rawId, 10) : 0;

    this.loadRejectedOrders();
    this.getOrders();
  }

  /* -------------------- Data -------------------- */

  getOrders() {
    this.orderList = [];
    this.httpService.getorders().subscribe(
      (data: Order[]) => {
        const list = (data ?? []).slice();
        this.orderList = this.sortOrders(list);  // Delivered last
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred while fetching list. Please try again later.';
      }
    );
  }

  /** Delivered last, In Transit middle, Initiated first; then by date asc; then id */
  private sortOrders(list: Order[]): Order[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('delivered')) return 2;  // last
      if (v.includes('transit'))   return 1;  // middle
      return 0;                                // first
    };

    return list.sort((a, b) => {
      const ra = rank(a.status);
      const rb = rank(b.status);
      if (ra !== rb) return ra - rb;

      const da = new Date(a.orderDate).getTime();
      const db = new Date(b.orderDate).getTime();
      if (!Number.isNaN(da) && !Number.isNaN(db) && da !== db) return da - db;

      return (a.id ?? 0) - (b.id ?? 0);
    });
  }

  /* -------------------- Actions -------------------- */

  edit(value: Order) {
    this.statusModel.orderId = value.id;
    this.showMessage = false;
  }

  update() {
    if (this.statusModel.newStatus && this.statusModel.orderId != null) {
      this.httpService
        .UpdateOrderStatus(this.statusModel.newStatus, this.statusModel.orderId)
        .subscribe(
          () => {
            this.showMessage = true;
            this.responseMessage = 'Status updated';
            this.getOrders();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = 'An error occurred while updating status. Please try again later.';
          }
        );
    }
  }

  acceptOrder(orderId: number) {
    this.showError = false;
    this.showMessage = false;

    // clear any local reject
    this.rejectedOrderIds = this.rejectedOrderIds.filter(x => x !== orderId);
    localStorage.setItem(this.rejectedOrderKey(), JSON.stringify(this.rejectedOrderIds));

    this.httpService.respondOrder(orderId, 'ACCEPT').subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = 'Order accepted';
        this.getOrders();
      },
      (err) => {
        this.showError = true;
        this.errorMessage = err?.error?.message || 'Failed to accept order';
      }
    );
  }

  /* -------------------- Local reject storage -------------------- */

  private rejectedOrderKey(): string {
    const uname = (localStorage.getItem('username') || 'unknown').toLowerCase();
    return `rejectedOrders_${uname}`;
  }

  loadRejectedOrders() {
    const raw = localStorage.getItem(this.rejectedOrderKey());
    this.rejectedOrderIds = raw ? JSON.parse(raw) : [];
  }

  isOrderRejected(id: number): boolean {
    return this.rejectedOrderIds.includes(id);
  }

  rejectOrderLocally(id: number) {
    if (!this.rejectedOrderIds.includes(id)) {
      this.rejectedOrderIds.push(id);
      localStorage.setItem(this.rejectedOrderKey(), JSON.stringify(this.rejectedOrderIds));
    }
  }

  canEditOrder(order: Order): boolean {
    const req = (order.requestStatus || '').toString().trim().toUpperCase();
    const assigned = order.assignedSupplierId == null ? 0 : Number(order.assignedSupplierId);
    return req === 'ACCEPTED' && assigned === this.currentSupplierId && !this.isDelivered(order.status);
  }

  /* -------------------- Map (DomSanitizer) -------------------- */

  hasHospitalInfo(o: Order): boolean {
    const hosp = o.equipment?.hospital;
    if (!hosp) return false;
    return (typeof hosp.lat === 'number' && typeof hosp.lng === 'number') || !!hosp.location || !!hosp.name;
  }

  toggleMap(id: number) {
    if (this.openMaps.has(id)) this.openMaps.delete(id);
    else this.openMaps.add(id);
  }

  isMapOpen(id: number): boolean {
    return this.openMaps.has(id);
  }

  getMapUrl(o: Order): SafeResourceUrl {
    const cached = this.mapCache.get(o.id);
    if (cached) return cached;

    const hosp = o.equipment?.hospital;
    let url = 'about:blank';

    if (hosp?.lat != null && hosp?.lng != null) {
      url = `https://www.google.com/maps?q=${hosp.lat},${hosp.lng}&z=14&output=embed`;
    } else {
      const parts: string[] = [];
      if (hosp?.name) parts.push(hosp.name);
      if (hosp?.location) parts.push(hosp.location);
      const q = encodeURIComponent(parts.join(', ').trim());
      url = `https://www.google.com/maps?q=${q}&z=14&output=embed`;
    }

    const safe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.mapCache.set(o.id, safe);
    return safe;
  }

  /* -------------------- UI helpers -------------------- */

  trackByOrderId(_index: number, item: Order) {
    return item?.id;
  }

  isDelivered(status: string | undefined | null): boolean {
    return (status || '').toLowerCase().includes('delivered');
  }

  statusClass(status: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 'status-delivered';
    if (s.includes('transit')) return 'status-transit';
    return 'status-initiated';
  }

  /* Legacy (if used elsewhere) */
  getStatusStyle(status: string) {
    if (status === 'Delivered') {
      return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
    } else if (status === 'In Transit') {
      return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
    } else {
      return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
    }
  }

  cardToneClass(index: number): string {
    const tone = (index % 3) + 1; // 1..3
    return `tone-${tone}`;
  }

  /* -------------------- Shake animation -------------------- */

  shakeCard(id: number) {
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
}
