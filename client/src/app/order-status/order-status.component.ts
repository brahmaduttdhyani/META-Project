import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  orderList: any = [];
  showError: boolean = false;
  errorMessage: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderList = [];
    this.httpService.getorderEquipment().subscribe(
      (data: any) => {
        this.orderList = data;
        console.log(data);
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error occurred while loading orders. Please try again later.';
        console.error('Orders error:', error);
      }
    );
  }

  getStatusStyle(status: string) {
    if (status === 'Delivered') {
      return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
    } else if (status === 'In Transit') {
      return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
    } else {
      return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
    }
  }
}
