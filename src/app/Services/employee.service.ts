import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Employee } from '../Models/Employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:5005/api/employee';
  // private url: string = 'http://localhost:3000/empData';

  get(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url);
  }

  getById(empNo: string): Observable<Employee | undefined> {
    return this.get().pipe(
      map(employees => employees.find(employee => employee.empNo === empNo))
    );
  }

  post(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.url, employee);
  }

  deleteById(empNo: string): Observable<void> {
    const deleteUrl = `${this.url}/${empNo}`;
    return this.http.delete<void>(deleteUrl);
  }

  update(empNo: string, employee: Employee): Observable<Employee> {
    const updateUrl = `${this.url}/${empNo}`;
    return this.http.put<Employee>(updateUrl, employee);
  }
}