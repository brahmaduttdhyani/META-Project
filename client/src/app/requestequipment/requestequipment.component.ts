
// import { Component, OnInit } from '@angular/core';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormGroup,
//   ValidationErrors,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';

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
//   //
// }
// interface Order {
//   id: number;
//   orderDate: string | Date;
//   quantity: number;
//   status: string;
//   equipment: Equipment;
// }

// @Component({
//   selector: 'app-requestequipment',
//   templateUrl: './requestequipment.component.html',
//   styleUrls: ['./requestequipment.component.scss'],
// })
// export class RequestequipmentComponent implements OnInit {
//   itemForm: FormGroup;

//   hospitalList: Hospital[] = [];
//   equipmentList: Equipment[] = [];
//   orderList: Order[] = [];

//   // UI state
//   showError = false;
//   errorMessage: string | null = null;
//   showMessage = false;
//   responseMessage: string | null = null;
//   isClick = false; // show/hide the whole orders section

//   todayLabel = ''; // for date hint

//   // Expanded card ids
//   private expanded = new Set<number>();

//   constructor(
//     public router: Router,
//     public httpService: HttpService,
//     private formBuilder: FormBuilder,
//     private authService: AuthService
//   ) {
//     const today = new Date();
//     this.todayLabel = today.toLocaleDateString(undefined, {
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit',
//     });

//     this.itemForm = this.formBuilder.group({
//       orderDate: ['', [Validators.required, this.dateValidator]],
//       quantity: [null, [Validators.required, Validators.min(1)]],
//       status: ['', [Validators.required]],
//       equipmentId: ['', [Validators.required, this.requiredSelect]],
//       hospitalId: ['', [Validators.required, this.requiredSelect]],
//     });
//   }

//   ngOnInit(): void {
//     this.getHospital();
//     this.getOrders();
//   }

//   /* -------------------- Validators -------------------- */

//   requiredSelect = (control: AbstractControl): ValidationErrors | null => {
//     const v = control.value;
//     if (v === null || v === undefined || v === '' || v === 'null') {
//       return { required: true };
//     }
//     return null;
//   };

//   dateValidator(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
//     if (!value) return { invalidDate: true };
//     const datePattern = /^\d{4}-\d{2}-\d{2}$/;
//     if (!datePattern.test(value)) return { invalidDate: true };
//     const picked = new Date(value);
//     if (Number.isNaN(picked.getTime())) return { invalidDate: true };

//     const today = new Date();
//     const sameDay =
//       picked.getFullYear() === today.getFullYear() &&
//       picked.getMonth() === today.getMonth() &&
//       picked.getDate() === today.getDate();

//     return sameDay ? null : { notToday: true };
//   }

//   /* -------------------- Data Loads -------------------- */

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

//   // ADD: helper to decide visibility — cancels allowed until "in transit"
// isCancelable(status: string | null | undefined): boolean {
//   const key = (status || '').toLowerCase();
//   // block when in transit or delivered or already cancelled
//   if (key.includes('transit') || key.includes('deliver') || key.includes('cancel')) {
//     return false;
//   }
//   return true;
// }
 
// // ADD: cancel handler
// // onCancel(order: Order) {
// //   if (!order?.id) { return; }
 
// //   // Optional guard for UX
// //   const ok = confirm(`Cancel order #${order.id}? This cannot be undone.`);
// //   if (!ok) { return; }
 
// //   this.showError = false;
// //   this.showMessage = false;
 
// //   this.httpService.cancelOrder(order.id).subscribe(
// //     () => {
// //       this.showMessage = true;
// //       this.responseMessage = `Order #${order.id} cancelled successfully.`;
// //       // Refresh list and collapse toggles for accuracy
// //       this.getOrders();
// //     },
// //     (error) => {
// //       this.showError = true;
// //       // Show server message if any, else fallback
// //       this.errorMessage = error?.error?.message
// //         || `Unable to cancel order #${order.id}. It may already be in transit.`;
// //       console.error('cancelOrder error:', error);
// //     }
// //   );
// // }

// onCancel(order: Order) {
//   if (!order?.id) return;

//   const ok = confirm(`Cancel order #${order.id}? This cannot be undone.`);
//   if (!ok) return;

//   this.showError = false;
//   this.showMessage = false;

//   this.httpService.cancelOrder(order.id).subscribe(
//     () => {
//       // ✅ 1) Immediately update UI so Cancel button disappears
//       const idx = this.orderList.findIndex(o => o.id === order.id);
//       if (idx !== -1) {
//         this.orderList[idx] = {
//           ...this.orderList[idx],
//           status: 'Cancelled',
//         };
//       }

//       // ✅ 2) Optional: collapse the card after cancelling
//       this.expanded.delete(order.id);

//       this.showMessage = true;
//       this.responseMessage = `Order #${order.id} cancelled successfully.`;

//       // ✅ 3) Refresh from server (keeps everything accurate)
//       this.getOrders();
//     },
//     (error) => {
//       this.showError = true;
//       this.errorMessage =
//         error?.error?.message ||
//         `Unable to cancel order #${order.id}. It may already be in transit.`;
//       console.error('cancelOrder error:', error);
//     }
//   );
// }


//   getOrders() {
//     this.orderList = [];
//     this.httpService.getorderEquipment().subscribe(
//       (data: Order[]) => {
//         this.orderList = data ?? [];
//         // Optional: collapse all on refresh
//         this.expanded.clear();
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage =
//           'An error occurred while fetching orders. Please try again later.';
//         console.error('getOrders error:', error);
//       }
//     );
//   }

//   onHospitalSelect($event: Event) {
//     const select = $event.target as HTMLSelectElement;
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

//   /* -------------------- Actions -------------------- */

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
//       quantity: Number(this.itemForm.value.quantity),
//     };

//     this.httpService.orderEquipment(payload, payload.equipmentId).subscribe(
//       () => {
//         this.itemForm.reset();
//         this.itemForm.patchValue({ equipmentId: '', hospitalId: '', status: '' });

//         this.showMessage = true;
//         this.responseMessage = 'Ordered Successfully';
//         this.getOrders();
//       },
//       (error) => {
//         this.showError = true;
//         this.errorMessage =
//           'An error occurred while requesting. Please try again later.';
//         console.error('orderEquipment error:', error);
//       }
//     );
//   }

//   showStatus() {
//     this.showMessage = false;
//     this.isClick = !this.isClick;
//   }

//   /* -------------------- Expand/Collapse helpers -------------------- */

//   toggleExpand(id: number) {
//     if (this.expanded.has(id)) {
//       this.expanded.delete(id);
//     } else {
//       this.expanded.add(id);
//     }
//   }

//   isExpanded(id: number): boolean {
//     return this.expanded.has(id);
//   }

//   // For CSS height animation, measure approximate expanded height (can be tuned)
//   getCardExpandHeight(_val: Order): number {
//     // ~ blocks + actions
//     return 320; // px; adjust if your content grows
//   }

//   /* -------------------- UI Helpers -------------------- */

//   trackByOrderId(_index: number, item: Order) {
//     return item?.id;
//   }

//   statusClass(status: string) {
//     const key = (status || '').toLowerCase();
//     if (key.includes('deliver')) return 'status-delivered';
//     if (key.includes('transit')) return 'status-transit';
//     return 'status-initiated';
//   }

//   /* -------------------- Button actions inside expanded area -------------------- */

//   onDetails(order: Order) {
//     // You can navigate or open a side panel; using console for now.
//     console.log('Details clicked for order:', order);
//   }

//   onTrack(order: Order) {
//     // Hook this to your tracking flow (route or modal)
//     console.log('Track clicked for order:', order);
//   }
  
// }



import {
  Component, OnInit, Directive, ElementRef, Renderer2,
  HostListener, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

interface Hospital { id: number; name: string; location?: string; }
interface Equipment { id: number; name: string; description?: string; hospital?: Hospital; }
interface Order { id: number; orderDate: string | Date; quantity: number; status: string; equipment: Equipment; }

/* ===========================
   3D Tilt Directive (subtle)
   =========================== */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  @Input('appTilt') maxTilt = 6; // degrees
  private rect?: DOMRect;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {
    this.r.setStyle(this.el.nativeElement, 'transformStyle', 'preserve-3d');
    this.r.setStyle(this.el.nativeElement, 'willChange', 'transform');
  }

  @HostListener('mouseenter') onEnter() {
    this.rect = this.el.nativeElement.getBoundingClientRect();
  }
  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    if (!this.rect) this.rect = this.el.nativeElement.getBoundingClientRect();
    const x = e.clientX - this.rect.left;
    const y = e.clientY - this.rect.top;
    const midX = this.rect.width / 2;
    const midY = this.rect.height / 2;

    const rx = ((y - midY) / midY) * -this.maxTilt;
    const ry = ((x - midX) / midX) * this.maxTilt;

    this.r.setStyle(this.el.nativeElement, '--rx', `${rx.toFixed(2)}deg`);
    this.r.setStyle(this.el.nativeElement, '--ry', `${ry.toFixed(2)}deg`);
  }
  @HostListener('mouseleave') onLeave() { this.reset(); }
  @HostListener('blur') onBlur() { this.reset(); }
  private reset() {
    this.r.setStyle(this.el.nativeElement, '--rx', `0deg`);
    this.r.setStyle(this.el.nativeElement, '--ry', `0deg`);
  }
}

/* ===========================
   CountUp Directive (numbers)
   =========================== */
@Directive({ selector: '[appCountUp]' })
export class CountUpDirective implements OnChanges {
  @Input('appCountUp') value = 0;
  @Input() animate = true;
  @Input() duration = 700; // ms
  private startValue = 0;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnChanges(_: SimpleChanges): void {
    this.render();
  }

  private render() {
    const target = Number(this.value) || 0;
    if (!this.animate || this.duration <= 0) {
      this.el.nativeElement.textContent = `${Math.round(target)}`;
      this.startValue = target;
      return;
    }

    const start = performance.now();
    const from = this.startValue || 0;
    const delta = target - from;
    const dur = this.duration;

    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + delta * e);
      this.el.nativeElement.textContent = `${v}`;
      if (p < 1) requestAnimationFrame(step);
      else this.startValue = target;
    };
    requestAnimationFrame(step);
  }
}

@Component({
  selector: 'app-requestequipment',
  templateUrl: './requestequipment.component.html',
  styleUrls: ['./requestequipment.component.scss'],
})
export class RequestequipmentComponent implements OnInit {
  itemForm: FormGroup;

  hospitalList: Hospital[] = [];
  equipmentList: Equipment[] = [];
  orderList: Order[] = [];

  // UI state
  showError = false;
  errorMessage: string | null = null;
  showMessage = false;
  responseMessage: string | null = null;
  isClick = false;

  todayLabel = '';

  // Expand tracking
  private expanded = new Set<number>();

  // Progress ring math (r = 16)
  circumference = Math.round(2 * Math.PI * 16);

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    const today = new Date();
    this.todayLabel = today.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    this.itemForm = this.formBuilder.group({
      orderDate: ['', [Validators.required, this.dateValidator]],
      quantity: [null, [Validators.required, Validators.min(1)]],
      status: ['', [Validators.required]],
      equipmentId: ['', [Validators.required, this.requiredSelect]],
      hospitalId: ['', [Validators.required, this.requiredSelect]],
    });
  }

  ngOnInit(): void {
    this.getHospital();
    this.getOrders();
  }

  /* -------------------- Validators -------------------- */
  requiredSelect = (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    return (v === null || v === undefined || v === '' || v === 'null') ? { required: true } : null;
  };

  // Must be exactly today's date (YYYY-MM-DD)
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { invalidDate: true };
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(value)) return { invalidDate: true };

    const picked = new Date(value);
    if (Number.isNaN(picked.getTime())) return { invalidDate: true };

    const today = new Date();
    return (
      picked.getFullYear() === today.getFullYear() &&
      picked.getMonth() === today.getMonth() &&
      picked.getDate() === today.getDate()
    ) ? null : { notToday: true };
  }

  /* -------------------- Data Loads -------------------- */
  getHospital() {
    this.hospitalList = [];
    this.httpService.getHospital().subscribe(
      (data: Hospital[]) => { this.hospitalList = data ?? []; },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('getHospital error:', error);
      }
    );
  }

  getOrders() {
    this.orderList = [];
    this.httpService.getorderEquipment().subscribe(
      (data: Order[]) => {
        const list = (data ?? []).slice();
        this.orderList = this.sortOrders(list);
        this.expanded.clear();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred while fetching orders. Please try again later.';
        console.error('getOrders error:', error);
      }
    );
  }

  onHospitalSelect($event: Event) {
    const select = $event.target as HTMLSelectElement;
    const id = parseInt(select.value, 10);
    if (!Number.isFinite(id)) {
      this.equipmentList = [];
      return;
    }

    this.equipmentList = [];
    this.httpService.getEquipmentById(id).subscribe(
      (data: Equipment[]) => { this.equipmentList = data ?? []; },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred. Please try again later.';
        console.error('getEquipmentById error:', error);
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
      quantity: Number(this.itemForm.value.quantity),
    };

    this.httpService.orderEquipment(payload, payload.equipmentId).subscribe(
      () => {
        this.itemForm.reset();
        this.itemForm.patchValue({ equipmentId: '', hospitalId: '', status: '' });
        this.showMessage = true;
        this.responseMessage = 'Ordered Successfully';
        this.getOrders();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred while requesting. Please try again later.';
        console.error('orderEquipment error:', error);
      }
    );
  }

  showStatus() {
    this.showMessage = false;
    this.isClick = !this.isClick;
  }

  /* -------------------- Cancel -------------------- */
  isCancelable(status: string | null | undefined): boolean {
    const key = (status || '').toLowerCase();
    if (key.includes('transit') || key.includes('deliver') || key.includes('cancel') || key.includes('service')) return false;
    return true;
  }

  onCancel(order: Order) {
    if (!order?.id) return;

    const ok = confirm(`Cancel order #${order.id}? This cannot be undone.`);
    if (!ok) return;

    this.showError = false;
    this.showMessage = false;

    this.httpService.cancelOrder(order.id).subscribe(
      () => {
        const idx = this.orderList.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orderList[idx] = { ...this.orderList[idx], status: 'Cancelled' };
        this.expanded.delete(order.id);
        this.showMessage = true;
        this.responseMessage = `Order #${order.id} cancelled successfully.`;
        this.getOrders();
      },
      (error) => {
        this.showError = true;
        this.errorMessage = error?.error?.message
          || `Unable to cancel order #${order.id}. It may already be in transit.`;
        console.error('cancelOrder error:', error);
      }
    );
  }

  /* -------------------- Sorting -------------------- */
  private sortOrders(list: Order[]): Order[] {
    const rank = (s = '') => {
      const v = s.toLowerCase();
      if (v.includes('deliver') || v.includes('cancel') || v.includes('service')) return 2;
      if (v.includes('transit')) return 1;
      return 0;
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

  /* -------------------- Expand/Collapse -------------------- */
  toggleExpand(id: number) {
    if (this.expanded.has(id)) this.expanded.delete(id);
    else this.expanded.add(id);
  }
  isExpanded(id: number): boolean { return this.expanded.has(id); }
  getCardExpandHeight(_val: Order): number { return 320; }

  /* -------------------- UI Helpers -------------------- */
  trackByOrderId(_index: number, item: Order) { return item?.id; }

  isDelivered(status: string | null | undefined) { return (status || '').toLowerCase().includes('deliver'); }
  isCancelled(status: string | null | undefined) { return (status || '').toLowerCase().includes('cancel'); }
  isServiced(status: string | null | undefined) { return (status || '').toLowerCase().includes('service'); }

  isFinal(status: string | null | undefined) {
    return this.isDelivered(status) || this.isCancelled(status) || this.isServiced(status);
  }

  statusClass(status: string) {
    const key = (status || '').toLowerCase();
    if (key.includes('deliver')) return 'status-delivered';
    if (key.includes('transit')) return 'status-transit';
    if (key.includes('cancel')) return 'status-cancelled';
    if (key.includes('service')) return 'status-serviced'; // (optional if you add style later)
    return 'status-initiated';
  }

  statusIcon(status: string) {
    const key = (status || '').toLowerCase();
    if (key.includes('deliver')) return '✔';
    if (key.includes('transit')) return '🚚';
    if (key.includes('cancel')) return '⛔';
    if (key.includes('service')) return '🛠';
    return '🕒';
  }

  cardToneClass(index: number): string { return `tone-${(index % 3) + 1}`; }

  borderClass(status: string): string {
    const key = (status || '').toLowerCase();
    if (key.includes('deliver')) return 'border-delivered';
    if (key.includes('transit')) return 'border-transit';
    if (key.includes('cancel')) return 'border-cancelled';
    if (key.includes('service')) return 'border-serviced'; // optional (scss provided)
    return 'border-initiated';
  }

  /* -------------------- Progress Ring -------------------- */
  progressPercent(status: string): number {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 100;
    if (s.includes('service')) return 100; // serviced treated as complete
    if (s.includes('transit')) return 70;
    if (s.includes('cancel')) return 0;
    return 30;
  }
  progressDashOffset(status: string): number {
    const p = this.progressPercent(status);
    return Math.round((100 - p) / 100 * this.circumference);
  }
}

