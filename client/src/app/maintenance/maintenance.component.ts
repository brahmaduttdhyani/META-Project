import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  itemForm: FormGroup;
  showMessage: any;
  responseMessage: any;
  maintenanceList: any = [];
  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    if (
      authService.getRole != 'HOSPITAL' &&
      authService.getRole != 'TECHNICIAN'
    ) {
      this.router.navigateByUrl('dashboard'); // To restict other user to accessing the api which meant for technicican
    }
    //to Store the value which is coming in the form using the formbuilder
    this.itemForm = this.formBuilder.group({
      scheduledDate: [
        this.formModel.scheduledDate,
        [Validators.required, this.dateValidator],
      ],
      completedDate: [
        this.formModel.completedDate,
        [Validators.required, this.dateValidator],
      ],
      description: [this.formModel.description, [Validators.required]],
      status: [this.formModel.status, [Validators.required]],
      maintenanceId: [this.formModel.maintenanceId],
    });
  }

  ngOnInit(): void {
    //this method get initiate first
    this.getMaintenance();
  }
  //Custom Validation for Date
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(control.value)) {
      return { invalidDate: true };
    }

    return null;
  }

  //This method is reponsible to fetch data about the maintenance status in the form list from the backend
  getMaintenance() {
    this.maintenanceList = [];
    this.httpService.getMaintenance().subscribe(
      (data: any) => {
        // subscribe it used to handle the observable method response
        this.maintenanceList = data;
      },
      (error) => {
        // Handle error
        this.showError = true;
        this.errorMessage = 'An error has Occured.Try again';
        console.error('Login error:', error);
      }
    );
  }
  // this method is reponsible got editing the completion date along with the status of the Maintenance of it
  edit(val: any) {
    const scheduledDate = new Date(val.scheduledDate); // conversion form string to Date format for easy manipulation and formatting the date Values
    const completedDate = new Date(val.completedDate);
    // updating the formGroup using patchValue method
    // patchValue allows you to set the values of specific form controls within the FormGroup.
    this.itemForm.patchValue({
      // updating the formGroup using patchValue method
      scheduledDate: scheduledDate.toISOString().substring(0, 10),
      completedDate: completedDate.toISOString().substring(0, 10),
      description: val.description,
      status: val.status,
      equipmentId: val.equipmentId,
      maintenanceId: val.id,
    });
  }
  //Responsible for updating the status for that particular maintenance
  update() {
    if (this.itemForm.valid) {
      if (this.itemForm.valid) {
        this.showError = false;
        this.httpService
          .updateMaintenance(
            this.itemForm.value,
            this.itemForm.controls['maintenanceId'].value
          )
          .subscribe(
            (data: any) => {
              this.itemForm.reset();
              window.location.reload();
            },
            (error) => {
              // Handle error
              this.showError = true;
              this.errorMessage =
                'An error occurred while Loggin in Please Try Again';
              console.error('Login error:', error);
            }
          );
      } else {
        this.itemForm.markAllAsTouched();
      }
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
  // This method is used for styling the status of maintence with help nystyle in Html part
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

