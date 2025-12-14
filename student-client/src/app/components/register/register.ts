import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  register() {
    if (!this.email || !this.password) {
      alert('Email and password are required');
      console.log('required');
      return;
    }
  console.log('Email:', this.email);
  console.log('Password:', this.password);

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        alert('Registration successful. Please login.');
        this.email = '';
        this.password = '';
      },
      error: (err) => {
        console.error(err);
        alert('Registration failed');
      }
    });
  }
}