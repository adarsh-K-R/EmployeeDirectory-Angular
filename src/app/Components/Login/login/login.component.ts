import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../Services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authService: LoginService, private router: Router) { }

  username: string = 'jon';
  password: string = 'p@ssw0rD';

  ngOnInit(): void {
    this.addInputFocusListeners();
  }

  addInputFocusListeners() {
    const inputs = document.querySelectorAll('.input-box input');

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.previousElementSibling!.classList.add('active');
      });

      input.addEventListener('blur', () => {
        if ((input as HTMLInputElement).value === '') {
          input.previousElementSibling!.classList.remove('active');
        }
      });
    });
  }

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response) {
        this.router.navigate(['/employees']);
      } else {
        alert('Login failed');
      }
    });
  }
}