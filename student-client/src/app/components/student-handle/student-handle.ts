import { Component, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

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

  students: Student[] = [];
  hydrated = false;

  id: number | null = null;
  name = '';
  className = '';
  section = '';

  isEditMode = false;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      queueMicrotask(() => {
        this.hydrated = true;

        this.authService.loggedIn$.subscribe(isLoggedIn => {
          if (isLoggedIn) {
            this.loadStudents();
          } else {
            this.students = [];
            this.cdr.markForCheck();
          }
        });

        if (this.authService.isLoggedIn()) {
          this.loadStudents();
        }
      });
    });
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: data => {
        this.students = data;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error(err);
        alert('Failed to load students');
        this.cdr.markForCheck();
      }
    });
  }

  saveStudent(): void {
    if (!this.name || !this.className || !this.section) {
      alert('All fields are required');
      return;
    }

    const student: Student = {
      name: this.name,
      className: this.className,
      section: this.section
    };

    if (this.isEditMode && this.id !== null) {
      this.studentService.updateStudent(this.id, student).subscribe({
        next: () => {
          this.loadStudents();
          this.resetForm();
        }
      });
    } else {
      this.studentService.addStudent(student).subscribe({
        next: () => {
          this.loadStudents();
          this.resetForm();
          this.cdr.markForCheck();
        }
      });
    }
  }

  editStudent(student: Student): void {
    this.isEditMode = true;
    this.id = student.id ?? null;
    this.name = student.name;
    this.className = student.className;
    this.section = student.section;
  }

  deleteStudent(id?: number): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents()
    });
  }

  resetForm(): void {
    this.id = null;
    this.name = '';
    this.className = '';
    this.section = '';
    this.isEditMode = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}