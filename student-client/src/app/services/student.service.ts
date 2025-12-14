import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private apiUrl = 'https://localhost:64638/api/students';

  constructor(private http: HttpClient) {}

  getStudents() {
    return this.http.get<any[]>(this.apiUrl);
  }

  addStudent(student: any) {
    return this.http.post(this.apiUrl, student);
  }

  updateStudent(id: number, student: any) {
    return this.http.put(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}