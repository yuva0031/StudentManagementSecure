import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = signal('');
  password = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.authService.login(this.email(), this.password()).subscribe({
      next: res => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/students']);
      },
      error: () => alert('Invalid email or password')
    });
  }
}