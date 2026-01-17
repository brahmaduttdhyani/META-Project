
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

export interface Hospital {
  id: number;
  name: string;
  location: string;
}

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit{
  // private formSubscription: Subscription;
  itemForm: FormGroup;
  equipmentForm: FormGroup;

  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  assignModel: any = {};
  filteredHospitalList: any = [];
  modalSearchQuery: any;
  showMessage: any;
  responseMessage: any;
  showHospitalfilterData: boolean = false;
  showHospitalData: boolean = true;
  isClick: boolean = true;
  search: Hospital[] = [];
  NotFoundMessage: string = '';
  FoundMessage: string = '';

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    if (authService.getRole != 'HOSPITAL') {
      this.router.navigateByUrl('dashboard');
    }

    // Initialize forms with empty strings; validators unchanged
    this.itemForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
    });

    this.equipmentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      hospitalId: ['', [Validators.required]],
    });

    // Keep the same behavior: clear messages on itemForm changes
    // this.formSubscription = this.itemForm.valueChanges.subscribe(() => {
    //   this.clearMessages();
    // });
  }

  ngOnInit(): void {
    this.getHospital();
  }

  getHospital() {
    this.httpService.getHospital().subscribe(
      (data: any) => {
        this.hospitalList = data;
        this.search = data;
      },
      (error) => {
        this.showError = true;
        this.errorMessage =
          'An error occurred while fetching hospitals. Please try again later.';
        console.error('Error fetching hospitals:', error);
      }
    );
  }

  // SEARCHING HOSPITAL BY NAME/LOCATION/ID (unchanged)
  filterHospital() {
    this.showHospitalfilterData = true;
    this.showHospitalData = false;

    if (!!this.modalSearchQuery) {
      const searchTerm = this.modalSearchQuery.toLowerCase().trim();
      this.filteredHospitalList = this.hospitalList.filter(
        (hosp: Hospital) =>
          hosp.name.toLowerCase().trim().includes(searchTerm) ||
          hosp.location.toLowerCase().trim().includes(searchTerm) ||
          hosp.id == searchTerm
      );

      if (this.filteredHospitalList.length == 0) {
        this.isClick = false;
        this.NotFoundMessage = 'No Hospital(s) Found!!';
        this.showHospitalData = true;
      } else {
        this.isClick = true;
        this.FoundMessage = this.filteredHospitalList.length + ' record(s) found!!';
      }
    } else {
      this.isClick = false;
      this.NotFoundMessage = 'Nothing to search';
      this.showHospitalData = true;
    }
  }

  closeIt() {
    this.showHospitalfilterData = false;
    this.showHospitalData = true;
    this.modalSearchQuery = '';
  }

  clearMessages() {
    this.showMessage = false;
    this.showError = false;
  }

  // ngOnDestroy(): void {
  //   this.formSubscription.unsubscribe();
  // }

  onSubmit() {
    if (this.itemForm.valid) {
      const newHospitalName = this.itemForm.value.name.toLowerCase().trim();
      const newHospitalLocation = this.itemForm.value.location.toLowerCase().trim();

      const isDuplicate = this.hospitalList.some((hospital: Hospital) => {
        return (
          hospital.name.toLowerCase().trim() === newHospitalName &&
          hospital.location.toLowerCase().trim() === newHospitalLocation
        );
      });

      if (isDuplicate) {
        this.showError = true;
        this.errorMessage = 'This hospital already exists.';
        this.showMessage = false;
      } else {
        this.httpService.createHospital(this.itemForm.value).subscribe(
          (data: any) => {
            this.itemForm.reset();
            this.getHospital();
            this.showMessage = true;
            this.responseMessage = `Hospital added successfully`;
            this.showError = false;
          },
          (error) => {
            this.showError = true;
            this.errorMessage =
              'An error occurred while creating hospital. Please try again later.';
            console.error('Error creating hospital:', error);
          }
        );
      }
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  Addequipment(value: any) {
    this.equipmentForm.controls['hospitalId'].setValue(value.id);
    this.showMessage = false;
  }

  submitEquipment() {
    if (this.equipmentForm.valid) {
      this.httpService
        .addEquipment(
          this.equipmentForm.value,
          this.equipmentForm.controls['hospitalId'].value
        )
        .subscribe(
          (data: any) => {
            this.showMessage = true;
            this.responseMessage = `Equipment added successfully`;
            this.equipmentForm.reset();
          },
          (error) => {
            this.showError = true;
            this.errorMessage =
              'An error occurred while adding equipment. Please try again later.';
            console.error('Error adding equipment:', error);
          }
        );
    } else {
      this.equipmentForm.markAllAsTouched();
    }
  }
}
