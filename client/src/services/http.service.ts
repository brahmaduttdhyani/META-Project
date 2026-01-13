import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public serverName = environment.apiUrl; // To get server name
  private headers: HttpHeaders;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.headers = this.createHeaders();
  }
  private createHeaders(): HttpHeaders {
    const authToken = this.authService.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return headers;
  }

  private getRequestOptions(): { headers: HttpHeaders } {
    return { headers: this.headers };
  }

  //update the order status from supplier end
  UpdateOrderStatus(newStatus: any, orderId: any): Observable<any> {
    return this.http.put<any>(
      this.serverName +
        '/api/supplier/order/update/' +
        orderId +
        '?newStatus=' +
        newStatus,
      {},
      this.getRequestOptions()
    );
  }
  //adding equipments to the particular hospital from admin end
  addEquipment(details: any, hospitalId: any): Observable<any> {
    return this.http.post<any>(
      `${this.serverName}/api/hospital/equipment?hospitalId=${hospitalId}`,
      details, // Body
      this.getRequestOptions()
    );
  }

  //supplier will get all the orders requested by hospitals
  getorders(): Observable<any> {
    return this.http.get(
      this.serverName + `/api/supplier/orders`,
      this.getRequestOptions()
    );
  }

  // technician will get the maintenace list of equipments scheduled by the admin end
  getMaintenance(): Observable<any> {
    return this.http.get(
      this.serverName + `/api/technician/maintenance`,
      this.getRequestOptions()
    );
  }

  //In the admin side list of hospitals are shown in table
  getHospital(): Observable<any> {
    return this.http.get(
      this.serverName + `/api/hospitals`,
      this.getRequestOptions()
    );
  }
  //get particular equiment by its id
  getEquipmentById(id: any): Observable<any> {
    return this.http.get(
      this.serverName + `/api/hospital/equipment/` + id,
      this.getRequestOptions()
    );
  }

  //technician can update the status of the maintenance
  updateMaintenance(details: any, maintenanceId: any): Observable<any> {
    return this.http.put(
      this.serverName + '/api/technician/maintenance/update/' + maintenanceId,
      details,
      this.getRequestOptions()
    );
  }
  //hospital can order equipments for particular hospital
  orderEquipment(details: any, equipmentId: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/hospital/order?equipmentId=' + equipmentId,
      details,
      this.getRequestOptions()
    );
  }

  //hospital can schedule meaintenance for particular equipment for particular hospital
  scheduleMaintenance(details: any, equipmentId: any): Observable<any> {
    return this.http.post(
      this.serverName +
        '/api/hospital/maintenance/schedule?equipmentId=' +
        equipmentId,
      details,
      this.getRequestOptions()
    );
  }

  //admin can create multiple hospitals by giving name and location
  createHospital(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/hospital/create',
      details,
      this.getRequestOptions()
    );
  }

  //it will generate the authorization token while login and add to the header
  Login(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/login',
      details,
      this.getRequestOptions()
    );
  }

  // register the user
  registerUser(details: any): Observable<any> {
    return this.http.post(
      this.serverName + '/api/user/register',
      details,
      this.getRequestOptions()
    );
  }
}