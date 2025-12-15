import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

interface Student {
  id?: number;
  name: string;
  className: string;
  section: string;
}

@Component({
  selector: 'app-student-handle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-handle.html',
  styleUrls: ['./student-handle.css']
})
export class StudentHandleComponent {

  students = signal<Student[]>([]);
  isEditMode = signal(false);
  hydrated = signal(true);

  id: number | null = null;
  name = '';
  className = '';
  section = '';

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.loadStudents();
      } else {
        this.students.set([]);
      }
    });
  }

  loadStudents() {
    this.studentService.getStudents().subscribe(data => this.students.set(data));
  }

  saveStudent() {
    const student = { name: this.name, className: this.className, section: this.section };

    if (this.isEditMode() && this.id) {
      this.studentService.updateStudent(this.id, student).subscribe(() => this.loadStudents());
    } else {
      this.studentService.addStudent(student).subscribe(() => this.loadStudents());
    }
    this.resetForm();
  }

  editStudent(s: Student) {
    this.isEditMode.set(true);
    this.id = s.id ?? null;
    this.name = s.name;
    this.className = s.className;
    this.section = s.section;
  }

  deleteStudent(id?: number) {
    if (!id) return;
    this.studentService.deleteStudent(id).subscribe(() => this.loadStudents());
  }

  resetForm() {
    this.id = null;
    this.name = '';
    this.className = '';
    this.section = '';
    this.isEditMode.set(false);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}