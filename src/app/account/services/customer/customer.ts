import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  // URL matches the Swagger image provided
  private apiUrl = 'http://localhost:8888/api/Customers/addCustomer';

  constructor(private http: HttpClient) {}

  addCustomer(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
