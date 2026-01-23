
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

export interface Hospital {
  id: number;
  name: string;
  location: string;
}

@Component({
  selector: 'app-createhospital',
  templateUrl: './createhospital.component.html',
  styleUrls: ['./createhospital.component.scss'],
})
export class CreatehospitalComponent implements OnInit, OnDestroy {
  private formSubscription!: Subscription;

  itemForm: FormGroup;
  equipmentForm: FormGroup;

  formModel: any = { status: null };
  showError = false;
  errorMessage: string | null = null;

  hospitalList: Hospital[] = [];
  filteredHospitalList: Hospital[] = [];

  // search / UI state
  modalSearchQuery: string = '';
  showMessage = false;
  responseMessage: string | null = null;

  showHospitalfilterData = false; // show filtered card grid
  showHospitalData = true; // show full card grid
  isClick = true;

  NotFoundMessage = '';
  FoundMessage = '';

  constructor(
    public router: Router,
    public httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    // If getRole is a getter property instead of a method, keep as is.
    if ((this.authService as any).getRole !== 'HOSPITAL') {
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
  }

  ngOnInit(): void {
    this.getHospital();

    // Clear messages when the add form changes to avoid stale alerts
    this.formSubscription = this.itemForm.valueChanges.subscribe(() => {
      this.clearMessages();
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  /* -------------------- Data -------------------- */

  getHospital() {
    this.httpService.getHospital().subscribe(
      (data: Hospital[]) => {
        this.hospitalList = data ?? [];
      },
      (error) => {
        this.showError = true;
        this.errorMessage =
          'An error occurred while fetching hospitals. Please try again later.';
        console.error('Error fetching hospitals:', error);
      }
    );
  }

  /* -------------------- Search -------------------- */

  filterHospital() {
    this.showHospitalfilterData = true;
    this.showHospitalData = false;

    const queryRaw = (this.modalSearchQuery || '').trim();
    if (!queryRaw) {
      this.isClick = false;
      this.NotFoundMessage = 'Nothing to search';
      this.showHospitalData = true;
      this.filteredHospitalList = [];
      return;
    }

    const q = queryRaw.toLowerCase();
    const qNum = Number.isFinite(+q) ? +q : NaN;

    this.filteredHospitalList = (this.hospitalList || []).filter((h) => {
      const idMatch = !Number.isNaN(qNum) ? h.id === qNum : (h.id + '').includes(q);
      const nameMatch = (h.name || '').toLowerCase().includes(q);
      const locMatch = (h.location || '').toLowerCase().includes(q);
      return idMatch || nameMatch || locMatch;
    });

    if (this.filteredHospitalList.length === 0) {
      this.isClick = false;
      this.NotFoundMessage = 'No hospital(s) found.';
      this.showHospitalData = true;
    } else {
      this.isClick = true;
      this.FoundMessage = `${this.filteredHospitalList.length} record(s) found.`;
    }
  }

  closeIt() {
    this.showHospitalfilterData = false;
    this.showHospitalData = true;
    this.modalSearchQuery = '';
    this.filteredHospitalList = [];
    this.isClick = true;
    this.NotFoundMessage = '';
    this.FoundMessage = '';
  }

  /* -------------------- Add Hospital -------------------- */

  onSubmit() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const newName = (this.itemForm.value.name || '').toLowerCase().trim();
    const newLoc = (this.itemForm.value.location || '').toLowerCase().trim();

    // duplicate protection (name + location)
    const isDuplicate = (this.hospitalList || []).some((h) => {
      return h.name.toLowerCase().trim() === newName && h.location.toLowerCase().trim() === newLoc;
    });

    if (isDuplicate) {
      this.showError = true;
      this.errorMessage = 'This hospital already exists.';
      this.showMessage = false;
      return;
    }

    this.httpService.createHospital(this.itemForm.value).subscribe(
      () => {
        this.itemForm.reset();
        this.getHospital();
        this.showMessage = true;
        this.responseMessage = 'Hospital added successfully';
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

  /* -------------------- Equipment -------------------- */

  Addequipment(value: Hospital) {
    this.equipmentForm.controls['hospitalId'].setValue(value.id);
    this.showMessage = false;
  }

  submitEquipment() {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    const payload = this.equipmentForm.value;
    const hospId = this.equipmentForm.controls['hospitalId'].value;

    this.httpService.addEquipment(payload, hospId).subscribe(
      () => {
        this.showMessage = true;
        this.responseMessage = 'Equipment added successfully';
        this.equipmentForm.reset();
      },
      (error) => {
        this.showError = true;
        this.errorMessage =
          'An error occurred while adding equipment. Please try again later.';
        console.error('Error adding equipment:', error);
      }
    );
  }

  /* -------------------- Helpers -------------------- */

  clearMessages() {
    this.showMessage = false;
    this.showError = false;
    this.responseMessage = null;
    this.errorMessage = null;
  }

  trackByHospitalId(_index: number, item: Hospital) {
    return item.id;
  }

  // Optional "Details" action demo (no nav)
  viewDetails(h: Hospital) {
    // Implement route or side panel when needed
    console.log('Hospital details:', h);
  }
}

