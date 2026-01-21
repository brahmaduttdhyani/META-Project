import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';


import { AppComponent } from './app.component';
import { DashbaordComponent } from './dashbaord/dashbaord.component';


import { CreatehospitalComponent } from './createhospital/createhospital.component';
import { ScheduleMaintenanceComponent } from './schedule-maintenance/schedule-maintenance.component';
import { RequestequipmentComponent } from './requestequipment/requestequipment.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrdersComponent } from './orders/orders.component';
import { MaintenanceStatusComponent } from './maintenance-status/maintenance-status.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ForgotPasswordComponent } from './forgotpassword/forgot-password.component';
import { ChatComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'dashboard', component: DashbaordComponent },
  { path: 'createhospital', component: CreatehospitalComponent },  
  { path: 'schedule-maintenance', component: ScheduleMaintenanceComponent },  
  { path: 'maintenance-status', component: MaintenanceStatusComponent },
  { path: 'requestequipment', component: RequestequipmentComponent },  
  {path:'chat',component:ChatComponent},
  // { path: 'maintenance', component: MaintenanceComponent },  
  { path: 'orders', component: OrdersComponent },  
  { path: 'order-status', component: OrderStatusComponent },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },

   // ✅ Technician Maintenance page
  { path: 'maintenance/pending', component: MaintenanceComponent },
  { path: 'maintenance/in-progress', component: MaintenanceComponent },
  { path: 'maintenance/serviced', component: MaintenanceComponent },

  // ✅ default maintenance page
  { path: 'maintenance', redirectTo: 'maintenance/pending', pathMatch: 'full' },

  // Supplier Order page
  { path: 'orders/pending', component: OrdersComponent },
  { path: 'orders/in-transit', component: OrdersComponent },
  { path: 'orders/delivered', component: OrdersComponent },
  {path:'forgot-password',component:ForgotPasswordComponent},
  { path: '**', redirectTo: '' },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
