import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Role } from '../Models/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:5005/api/role';
  // private url: string = 'http://localhost:3000/roleData';

  get(): Observable<Role[]> {
    return this.http.get<Role[]>(this.url);
  }

  getById(roleId: string): Observable<Role> {
    const url = `${this.url}/${roleId}`;
    return this.http.get<Role>(url);
  }

  getRolesByDepartmentId(departmentId: string): Observable<Role[]> {
    const url = `${this.url}/dept/${departmentId}`;
    return this.http.get<Role[]>(url);
  }

  post(role: Role): Observable<Role> {
    return this.http.post<Role>(this.url, role);
  }
}