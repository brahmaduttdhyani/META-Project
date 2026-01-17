import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

export interface Hospital{
  id: number;
  name: string;
  location: string;
}

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss']
})
export class CreatehospitalComponent implements OnInit {
  ////hii////
  // itemForm!: FormGroup; 
  // equipmentForm!: FormGroup; 
  // formModel:any={status:null}; 
  // showError:boolean=false; 
  // errorMessage:any; 
  // hospitalList:any=[]; //This variable used to store list of hospital information. 
  // assignModel: any={}; 
  // showMessage: any; 
  // responseMessage: any; 
  
  // constructor(){}

  // ngOnInit(): void {
    
  // }

  // getHospital() {}

  // onSubmit() {}
  
  // Addequipment(value:any) {} 
  
  // submitEquipment() {}


  private formSubscription: Subscription;
  itemForm: FormGroup;
  equipmentForm: FormGroup;
  formModel: any = { status: null };
  showError: boolean = false;
  errorMessage: any;
  hospitalList: any = [];
  assignModel: any = {};
  filteredHospitalList: any = []; // Newly added property to store filtered hospitals
  modalSearchQuery: any;
  showMessage: any;
  responseMessage: any;
  showHospitalfilterData: boolean = false; //FOR SHOWING THE FILTERED DATA
  showHospitalData: boolean = true; //TO SHOW ALL THE HOSPITALS
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

    this.itemForm = this.formBuilder.group({
      name: [this.formModel.name, [Validators.required]],
      location: [this.formModel.location, [Validators.required]],
    });

    this.equipmentForm = this.formBuilder.group({
      name: [this.formModel.name, [Validators.required]],
      description: [this.formModel.description, [Validators.required]],
      hospitalId: [this.formModel.hospitalId, [Validators.required]],
    });
    this.formSubscription = this.itemForm.valueChanges.subscribe(() => {
      this.clearMessages(); // Call method to clear messages
    });
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

  /*(hosp: Search) => hosp.name.toLowerCase().includes(searchTerm) */

  //SEACHING HOSPITAL BY IT'S NAME
  filterHospital() {
    this.showHospitalfilterData = true; // TO SHOW THE FILTERED HOSPITAL-LIST
    this.showHospitalData = false; // TO DISABLE ALL THE HOSPITAL LIST

    if (!!this.modalSearchQuery) {
      // Double bang operator is used to check whether the value is there or not
      const searchTerm = this.modalSearchQuery.toLowerCase().trim(); // Convert search query to lowercase and the trim it
      this.filteredHospitalList = this.hospitalList.filter(
        (hosp: Hospital) =>
          hosp.name.toLowerCase().trim().includes(searchTerm) ||
          hosp.location.toLowerCase().trim().includes(searchTerm) ||
          hosp.id == searchTerm
      );
      console.log(this.filteredHospitalList);
      if (this.filteredHospitalList.length == 0) {
        this.isClick = false;
        this.NotFoundMessage = 'No Hospital(s) Found!!';
        this.showHospitalData = true;
      } else {
        this.isClick = true;
        this.FoundMessage=this.filteredHospitalList.length+" record(s) found!!"
      }
    } else {
      this.isClick = false; // IF THE SEARCH FIELD DOES NOT HAVE ANY VALUE
      //this.filteredHospitalList = null;
      this.NotFoundMessage = 'Nothing to search';
      this.showHospitalData = true;
    }
  }




  

  //CLOSING THE LIST OF FILTERED SEARCHED HOSPITAL-lIST-->(to search)
  closeIt() {
    this.showHospitalfilterData = false;
    this.showHospitalData = true;
    this.modalSearchQuery = '';
  }




  //----------------------------------------------------------------------------------------------





  clearMessages() {
    this.showMessage = false;
    this.showError = false;
  }


  
  
  
  //---------------------------------------------------------------------------------------------





  ngOnDestroy(): void {
    // Unsubscribe from form value changes to avoid memory leaks
    this.formSubscription.unsubscribe();
  }


  
  
  
  //------------------------------------------------------------------------------------------------------

  
  
  
  
  onSubmit() {
    if (this.itemForm.valid) {
      const newHospitalName = this.itemForm.value.name.toLowerCase().trim();
      const newHospitalLocation = this.itemForm.value.location
        .toLowerCase()
        .trim();

      // Check if the new hospital name or location already exists
      const isDuplicate = this.hospitalList.some((hospital: Hospital) => {
        return (
          hospital.name.toLowerCase().trim() === newHospitalName &&
          hospital.location.toLowerCase().trim() === newHospitalLocation
        );
      });

      if (isDuplicate) {
        // Show error message for duplicate hospital
        this.showError = true;
        this.errorMessage = 'This hospital already exists.';
        this.showMessage = false;
      } else {
        // If not a duplicate, proceed to add the hospital
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

  /*---------------------------------------------------------------------------------------------------------------------------------*/

  Addequipment(value: any) {
    this.equipmentForm.controls['hospitalId'].setValue(value.id);
    this.showMessage = false;
  }

  /*---------------------------------------------------------------------------------------------------------------------------------*/

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
