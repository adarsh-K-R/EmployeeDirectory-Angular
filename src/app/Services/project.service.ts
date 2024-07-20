import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../Models/Project';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {}
  private url: string = 'http://localhost:5005/api/project';

  get(): Observable<Project[]> {
    return this.http.get<Project[]>(this.url);
  }
}