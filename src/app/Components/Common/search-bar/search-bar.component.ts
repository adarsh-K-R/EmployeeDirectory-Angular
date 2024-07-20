import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  constructor(private router: Router, private login: LoginService) {}
  logout() {
    this.login.logout();
    this.router.navigate(['']);
  }
}
