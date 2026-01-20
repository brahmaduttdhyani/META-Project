
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

interface Hospital {
  id: number;
  name: string;
  location?: string | null;
}

interface Equipment {
  id: number;
  name: string;
  description?: string | null;
  hospital?: Hospital | null;       // optional to match API reality
}

interface Order {
  id: number;
  orderDate: string | Date;
  quantity: number;
  status: string;                    // Delivered | In Transit | Initiated | ...
  equipment?: Equipment | null;      // optional to avoid strict warnings
  assignedSupplierName?: string | null;
}

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  orderList: Order[] = [];           // always an array → safe to use .length
  showError = false;
  errorMessage: string | null = null;

  // For tap/click shake animation
  private shaking = new Set<number>();

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderList = [];
    this.httpService.getorderEquipment().subscribe(
      (data: Order[]) => {
        const list = (data ?? []).slice();
        this.orderList = this.sortOrders(list); // Delivered last
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred while loading orders. Please try again later.';
        console.error('Orders error:', error);
      }
    );
  }

  /** Delivered last, In Transit middle, Initiated first; then by orderDate asc; then id */
  private sortOrders(list: Order[]): Order[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('delivered')) return 2;  // last
      if (v.includes('transit')) return 1;    // middle
      return 0;                               // first (initiated/others)
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

  cardToneClass(index: number): string {
    const tone = (index % 3) + 1; // 1..3
    return `tone-${tone}`;
  }

  /* -------------------- Actions (demo handlers) -------------------- */

  onDetails(o: Order) {
    console.log('Order details:', o);
    // TODO: navigate or open details side panel/modal
  }

  onTrack(o: Order) {
    console.log('Track order:', o);
    // TODO: open tracking timeline/modal
  }
}
