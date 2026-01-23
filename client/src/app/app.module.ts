import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
import { RegistrationComponent } from './registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../services/http.service';
import { DashbaordComponent } from './dashbaord/dashbaord.component';
 
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
 
import { CreatehospitalComponent } from './createhospital/createhospital.component';
import { ScheduleMaintenanceComponent } from './schedule-maintenance/schedule-maintenance.component';
import { RequestequipmentComponent } from './requestequipment/requestequipment.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrdersComponent } from './orders/orders.component';
import { MaintenanceStatusComponent } from './maintenance-status/maintenance-status.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { ForgotPasswordComponent } from './forgotpassword/forgot-password.component';
import { ChatComponent } from './chatbot/chatbot.component';
 
/** ⬇️ Import the two directives from the same file where they’re defined */
import {
  TiltDirective,
  CountUpDirective
} from './requestequipment/requestequipment.component';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DashbaordComponent,
    ChatComponent,
 
    LandingPageComponent,
    FooterComponent,
    CreatehospitalComponent,
    ScheduleMaintenanceComponent,
    RequestequipmentComponent,
    MaintenanceComponent,
    MaintenanceStatusComponent,
    OrdersComponent,
    OrderStatusComponent,
    ForgotPasswordComponent,
 
    /** ⬇️ Register custom directives so template bindings are known */
    TiltDirective,
    CountUpDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  /** ✅ Provide services only; do NOT put modules here */
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }