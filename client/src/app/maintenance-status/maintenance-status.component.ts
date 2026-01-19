import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-maintenance-status',
  templateUrl: './maintenance-status.component.html',
  styleUrls: ['./maintenance-status.component.scss'],
})
export class MaintenanceStatusComponent implements OnInit {
  maintenanceList: any = [];
  showError: boolean = false;
  errorMessage: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getMaintenance();
  }

  getMaintenance() {
    this.maintenanceList = [];
    this.httpService.getScheduleMaintenance().subscribe(
      (data: any) => {
        this.maintenanceList = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error has Occured. Try again';
        console.error('error:', error);
      }
    );
  }

  getStatusStyle(status: string) {
    if (status === 'Serviced') {
      return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
    } else if (status === 'In Progress') {
      return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
    } else {
      return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
    }
  }
}
