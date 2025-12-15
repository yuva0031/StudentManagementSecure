import { Component, signal } from '@angular/core';
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

  email = signal('');
  password = signal('');

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.email(), this.password()).subscribe({
      next: () => {
        alert('Registration successful');
        this.email.set('');
        this.password.set('');
      },
      error: () => alert('Registration failed')
    });
  }
}