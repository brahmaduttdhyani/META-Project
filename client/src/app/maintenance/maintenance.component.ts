// import { Component, OnInit } from '@angular/core';
// import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { HttpService } from '../../services/http.service';
// import { AuthService } from '../../services/auth.service';

// // new
// @Component({
//   selector: 'app-maintenance',
//   templateUrl: './maintenance.component.html',
//   styleUrls: ['./maintenance.component.scss']
// })
// export class MaintenanceComponent implements OnInit {
//   formModel: any = { status: null };
//   showError: boolean = false;
//   errorMessage: any;
//   hospitalList: any = [];
//   itemForm: FormGroup;
//   showMessage: any;
//   responseMessage: any;
//   maintenanceList: any = [];

//   currentTechId: number = 0;

//   constructor(
//     public router: Router,
//     public httpService: HttpService,
//     private formBuilder: FormBuilder,
//     private authService: AuthService
//   ) {
//     if (
//       authService.getRole != 'HOSPITAL' &&
//       authService.getRole != 'TECHNICIAN'
//     ) {
//       this.router.navigateByUrl('dashboard'); // To restict other user to accessing the api which meant for technicican
//     }
//     //to Store the value which is coming in the form using the formbuilder
//     this.itemForm = this.formBuilder.group({
//       scheduledDate: [
//         this.formModel.scheduledDate,
//         [Validators.required, this.dateValidator],
//       ],
//       completedDate: [
//         this.formModel.completedDate,
//         [Validators.required, this.dateValidator],
//       ],
//       description: [this.formModel.description, [Validators.required]],
//       status: [this.formModel.status, [Validators.required]],
//       maintenanceId: [this.formModel.maintenanceId],
//     });
//   }

//   ngOnInit(): void {

//     const rawId = localStorage.getItem('userId');
//     this.currentTechId = rawId ? parseInt(rawId, 10) : 0;
//     //this method get initiate first
//     this.getMaintenance();
//   }
//   //Custom Validation for Date
//   dateValidator(control: AbstractControl): ValidationErrors | null {
//     const datePattern = /^\d{4}-\d{2}-\d{2}$/;

//     if (!datePattern.test(control.value)) {
//       return { invalidDate: true };
//     }

//     return null;
//   }

//   //This method is reponsible to fetch data about the maintenance status in the form list from the backend
//   getMaintenance() {
//     this.maintenanceList = [];
//     this.httpService.getMaintenance().subscribe(
//       (data: any) => {
//         // subscribe it used to handle the observable method response
//         this.maintenanceList = data;
//       },
//       (error) => {
//         // Handle error
//         this.showError = true;
//         this.errorMessage = 'An error has Occured.Try again';
//         console.error('Login error:', error);
//       }
//     );
//   }

//   //next to methods for request
//   respond(maintenanceId: number, action: 'ACCEPT' | 'REJECT') {
//   this.httpService.respondMaintenance(maintenanceId, action).subscribe(
//     (data: any) => {
//       this.getMaintenance(); // refresh list
//     },
//     (error) => {
//       this.showError = true;
//       this.errorMessage = error?.error?.message || 'Failed to respond';
//     }
//   );
// }

//   canEdit(m: any): boolean {
//   const myId = Number(localStorage.getItem('userId') || 0);

//   // debug (remove later)
//   console.log('canEdit check => myId:', myId,
//     'assigned:', m.assignedTechnicianId,
//     'requestStatus:', m.requestStatus,
//     'status:', m.status
//   );

//   return (
//     (m.requestStatus?.toUpperCase() === 'ACCEPTED') &&
//     (Number(m.assignedTechnicianId) === myId) &&
//     (m.status !== 'Serviced')
//   );
// }

//   // this method is reponsible got editing the completion date along with the status of the Maintenance of it
//   edit(val: any) {
//     const scheduledDate = new Date(val.scheduledDate); // conversion form string to Date format for easy manipulation and formatting the date Values
//     const completedDate = new Date(val.completedDate);
//     // updating the formGroup using patchValue method
//     // patchValue allows you to set the values of specific form controls within the FormGroup.
//     this.itemForm.patchValue({
//       // updating the formGroup using patchValue method
//       scheduledDate: scheduledDate.toISOString().substring(0, 10),
//       completedDate: completedDate.toISOString().substring(0, 10),
//       description: val.description,
//       status: val.status,
//       equipmentId: val.equipment?.id,
//       maintenanceId: val.id,
//     });
//   }
//   //Responsible for updating the status for that particular maintenance
//   update() {
//     if (this.itemForm.valid) {
//       if (this.itemForm.valid) {
//         this.showError = false;
//         this.httpService
//           .updateMaintenance(
//             this.itemForm.value,
//             this.itemForm.controls['maintenanceId'].value
//           )
//           .subscribe(
//             (data: any) => {
//               this.itemForm.reset();
//               window.location.reload();
//             },
//             (error) => {
//               // Handle error
//               this.showError = true;
//               this.errorMessage =
//                 'An error occurred while Loggin in Please Try Again';
//               console.error('Login error:', error);
//             }
//           );
//       } else {
//         this.itemForm.markAllAsTouched();
//       }
//     } else {
//       this.itemForm.markAllAsTouched();
//     }
//   }
//   // This method is used for styling the status of maintence with help nystyle in Html part
//   getStatusStyle(status: string) {
//     if (status === 'Serviced') {
//       return { color: 'green', 'font-weight': 'bold', 'font-size': '20px' };
//     } else if (status === 'In Progress') {
//       return { color: '#FFC300 ', 'font-weight': 'bold', 'font-size': '20px' };
//     } else {
//       return { color: '#3371FF', 'font-weight': 'bold', 'font-size': '20px' };
//     }
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
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
})
export class MaintenanceComponent implements OnInit {
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;

  itemForm: FormGroup;
  maintenanceList: any = [];

  showMessage: boolean = false;
  responseMessage: string = '';

  currentTechId: number = 0;

  // ✅ local reject storage (per technician)
  rejectedIds: number[] = [];

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
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

  // ✅ Date format validator
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }

  // ✅ Load maintenance list
  getMaintenance() {
    this.maintenanceList = [];
    this.httpService.getMaintenance().subscribe(
      (data: any) => {
        this.maintenanceList = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage = 'An error has Occured.Try again';
        console.error('Maintenance error:', error);
      }
    );
  }

  // ✅ ACCEPT (DB update)
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

  // ✅ Reject locally only (do NOT call backend)
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

  // ✅ Edit only if ACCEPTED and assigned to ME
  canEdit(m: any): boolean {
    return (
      (m.requestStatus?.toUpperCase() === 'ACCEPTED') &&
      (Number(m.assignedTechnicianId) === this.currentTechId) &&
      (m.status !== 'Serviced')
    );
  }

  // ✅ Fill modal form
  edit(val: any) {
    const scheduledDate = new Date(val.scheduledDate);
    const completedDate = new Date(val.completedDate);

    this.itemForm.patchValue({
      scheduledDate: scheduledDate.toISOString().substring(0, 10),
      completedDate: completedDate.toISOString().substring(0, 10),
      description: val.description,
      status: val.status,
      maintenanceId: val.id,
    });
  }

  // ✅ Update maintenance (only assigned tech allowed by backend)
  update() {
    if (this.itemForm.valid) {
      this.showError = false;

      this.httpService
        .updateMaintenance(this.itemForm.value, this.itemForm.controls['maintenanceId'].value)
        .subscribe(
          () => {
            this.itemForm.reset();
            this.getMaintenance();
          },
          (error) => {
            this.showError = true;
            this.errorMessage = error?.error?.message || 'Update failed';
            console.error('Update error:', error);
          }
        );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  // ✅ Styling
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
