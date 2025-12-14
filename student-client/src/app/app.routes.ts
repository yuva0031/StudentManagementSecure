import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { StudentHandleComponent } from './components/student-handle/student-handle';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'students',
    component: StudentHandleComponent,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'login' }
];