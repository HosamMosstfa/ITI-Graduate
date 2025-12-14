import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer';
describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService],
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to add a customer', () => {
    const mockCustomerData = { name: 'Ahmed', email: 'ahmed@test.com' };

    service.addCustomer(mockCustomerData).subscribe((response) => {
      expect(response).toEqual(mockCustomerData);
    });

    const req = httpMock.expectOne('http://localhost:8888/api/Customers/addCustomer');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCustomerData);

    req.flush(mockCustomerData);
  });
});
