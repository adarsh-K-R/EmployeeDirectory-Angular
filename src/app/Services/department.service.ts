import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../Models/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:5005/api/department';
  // private url: string = 'http://localhost:3000/departmentData';

  get(): Observable<Department[]> {
    return this.http.get<Department[]>(this.url);
  }
}