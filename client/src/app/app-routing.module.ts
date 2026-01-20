import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
import { CreatehospitalComponent } from './createhospital/createhospital.component';
import { ScheduleMaintenanceComponent } from './schedule-maintenance/schedule-maintenance.component';
import { RequestequipmentComponent } from './requestequipment/requestequipment.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrdersComponent } from './orders/orders.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  // 🌐 PUBLIC
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },

  // 🔐 AFTER LOGIN
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'createhospital', component: CreatehospitalComponent },
  { path: 'schedule-maintenance', component: ScheduleMaintenanceComponent },
  { path: 'requestequipment', component: RequestequipmentComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'orders', component: OrdersComponent },

  // fallback
  { path: '**', redirectTo: '' },
  // {path:'',redirectTo:'landing',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}