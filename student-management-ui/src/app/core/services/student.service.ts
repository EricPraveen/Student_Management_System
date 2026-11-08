import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateStudentDto, Student, StudentStatistics, UpdateStudentDto } from '../models/student.model';
import { ProblemDetails } from '../models/problem-details.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/students`;

  /**
   * Retrieves all students from the API.
   */
  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Retrieves a single student by ID.
   */
  public getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Registers a new student.
   */
  public createStudent(dto: CreateStudentDto): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Updates an existing student record.
   */
  public updateStudent(id: string, dto: UpdateStudentDto): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${encodeURIComponent(id)}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deletes a student by ID.
   */
  public deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Computes dashboard statistics from actual student records.
   */
  public calculateStatistics(students: Student[]): StudentStatistics {
    const total = students.length;
    let male = 0;
    let female = 0;
    let other = 0;

    for (const student of students) {
      const g = (student.gender || '').trim().toLowerCase();
      if (g === 'male') {
        male++;
      } else if (g === 'female') {
        female++;
      } else {
        other++;
      }
    }

    const malePercentage = total > 0 ? Math.round((male / total) * 100) : 0;
    const femalePercentage = total > 0 ? Math.round((female / total) * 100) : 0;
    const otherPercentage = total > 0 ? Math.round((other / total) * 100) : 0;

    return {
      total,
      male,
      female,
      other,
      malePercentage,
      femalePercentage,
      otherPercentage
    };
  }

  /**
   * Extracts clean user-facing error message from backend responses.
   */
  public formatErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.error) {
        const pd = error.error as ProblemDetails;
        if (pd.detail) {
          return pd.detail;
        }
        if (pd.title && !pd.errors) {
          return pd.title;
        }
        if (pd.errors) {
          const firstKey = Object.keys(pd.errors)[0];
          if (firstKey && pd.errors[firstKey]?.length) {
            return pd.errors[firstKey][0];
          }
        }
        if (typeof error.error === 'string') {
          return error.error;
        }
      }

      if (error.status === 0) {
        return 'Cannot connect to backend server. Please verify the API is running at ' + environment.apiUrl;
      }
      if (error.status === 404) {
        return 'The requested student record could not be found.';
      }
      if (error.status === 409) {
        return 'A student with this information already exists in the system.';
      }
      if (error.status === 500) {
        return 'An internal server error occurred while processing your request.';
      }
      return `Request failed with status code ${error.status} (${error.statusText || 'Error'})`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Extracts field-level validation errors from ProblemDetails response.
   */
  public extractValidationErrors(error: unknown): Record<string, string[]> {
    if (error instanceof HttpErrorResponse && error.error) {
      const pd = error.error as ProblemDetails;
      if (pd.errors) {
        const normalized: Record<string, string[]> = {};
        for (const [key, messages] of Object.entries(pd.errors)) {
          // Normalize key to camelCase so form controls match (e.g. FirstName -> firstName)
          const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
          normalized[camelKey] = messages;
          normalized[key] = messages;
        }
        return normalized;
      }
    }
    return {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => error);
  }
}
