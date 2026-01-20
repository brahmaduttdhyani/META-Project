
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
interface Order {
  id: number;
  orderDate: string | Date;
  quantity: number;
  status: string;
  equipment: Equipment;
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
  isClick = false; // show/hide the whole orders section

  todayLabel = ''; // for date hint

  // Expanded card ids
  private expanded = new Set<number>();

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
    if (v === null || v === undefined || v === '' || v === 'null') {
      return { required: true };
    }
    return null;
  };

  dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return { invalidDate: true };
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(value)) return { invalidDate: true };
    const picked = new Date(value);
    if (Number.isNaN(picked.getTime())) return { invalidDate: true };

    const today = new Date();
    const sameDay =
      picked.getFullYear() === today.getFullYear() &&
      picked.getMonth() === today.getMonth() &&
      picked.getDate() === today.getDate();

    return sameDay ? null : { notToday: true };
  }

  /* -------------------- Data Loads -------------------- */

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

  // ADD: helper to decide visibility — cancels allowed until "in transit"
isCancelable(status: string | null | undefined): boolean {
  const key = (status || '').toLowerCase();
  // block when in transit or delivered or already cancelled
  if (key.includes('transit') || key.includes('deliver') || key.includes('cancel')) {
    return false;
  }
  return true;
}
 
// ADD: cancel handler
onCancel(order: Order) {
  if (!order?.id) { return; }
 
  // Optional guard for UX
  const ok = confirm(`Cancel order #${order.id}? This cannot be undone.`);
  if (!ok) { return; }
 
  this.showError = false;
  this.showMessage = false;
 
  this.httpService.cancelOrder(order.id).subscribe(
    () => {
      this.showMessage = true;
      this.responseMessage = `Order #${order.id} cancelled successfully.`;
      // Refresh list and collapse toggles for accuracy
      this.getOrders();
    },
    (error) => {
      this.showError = true;
      // Show server message if any, else fallback
      this.errorMessage = error?.error?.message
        || `Unable to cancel order #${order.id}. It may already be in transit.`;
      console.error('cancelOrder error:', error);
    }
  );
}

  getOrders() {
    this.orderList = [];
    this.httpService.getorderEquipment().subscribe(
      (data: Order[]) => {
        this.orderList = data ?? [];
        // Optional: collapse all on refresh
        this.expanded.clear();
      },
      (error) => {
        this.showError = true;
        this.errorMessage =
          'An error occurred while fetching orders. Please try again later.';
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

  /* -------------------- Actions -------------------- */

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
        this.errorMessage =
          'An error occurred while requesting. Please try again later.';
        console.error('orderEquipment error:', error);
      }
    );
  }

  showStatus() {
    this.showMessage = false;
    this.isClick = !this.isClick;
  }

  /* -------------------- Expand/Collapse helpers -------------------- */

  toggleExpand(id: number) {
    if (this.expanded.has(id)) {
      this.expanded.delete(id);
    } else {
      this.expanded.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expanded.has(id);
  }

  // For CSS height animation, measure approximate expanded height (can be tuned)
  getCardExpandHeight(_val: Order): number {
    // ~ blocks + actions
    return 320; // px; adjust if your content grows
  }

  /* -------------------- UI Helpers -------------------- */

  trackByOrderId(_index: number, item: Order) {
    return item?.id;
  }

  statusClass(status: string) {
    const key = (status || '').toLowerCase();
    if (key.includes('deliver')) return 'status-delivered';
    if (key.includes('transit')) return 'status-transit';
    return 'status-initiated';
  }

  /* -------------------- Button actions inside expanded area -------------------- */

  onDetails(order: Order) {
    // You can navigate or open a side panel; using console for now.
    console.log('Details clicked for order:', order);
  }

  onTrack(order: Order) {
    // Hook this to your tracking flow (route or modal)
    console.log('Track clicked for order:', order);
  }
}
