import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/student.model';
import { environment } from '../../../environments/environment';

describe('StudentService', () => {
  let service: StudentService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateStatistics', () => {
    it('should correctly calculate statistics for empty list', () => {
      const stats = service.calculateStatistics([]);
      expect(stats.total).toBe(0);
      expect(stats.male).toBe(0);
      expect(stats.female).toBe(0);
      expect(stats.other).toBe(0);
      expect(stats.malePercentage).toBe(0);
      expect(stats.femalePercentage).toBe(0);
    });

    it('should calculate demographic counts and percentages accurately', () => {
      const mockStudents: Student[] = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', gender: 'Male' },
        { id: '2', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', gender: 'Female' },
        { id: '3', firstName: 'Alex', lastName: 'Smith', email: 'alex@example.com', gender: 'Other' },
        { id: '4', firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', gender: 'Male' }
      ];

      const stats = service.calculateStatistics(mockStudents);
      expect(stats.total).toBe(4);
      expect(stats.male).toBe(2);
      expect(stats.female).toBe(1);
      expect(stats.other).toBe(1);
      expect(stats.malePercentage).toBe(50);
      expect(stats.femalePercentage).toBe(25);
      expect(stats.otherPercentage).toBe(25);
    });
  });

  describe('API endpoints', () => {
    it('should fetch all students via GET /api/students', () => {
      const mockStudents: Student[] = [
        { id: '1', firstName: 'Eric', lastName: 'Praveen', email: 'eric@example.com' }
      ];

      service.getStudents().subscribe(students => {
        expect(students.length).toBe(1);
        expect(students[0].firstName).toBe('Eric');
      });

      const req = httpTesting.expectOne(`${environment.apiUrl}/students`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStudents);
    });

    it('should fetch single student by ID', () => {
      const mockStudent: Student = { id: 'STD-1', firstName: 'Eric', lastName: 'Praveen', email: 'eric@example.com' };

      service.getStudentById('STD-1').subscribe(student => {
        expect(student.id).toBe('STD-1');
      });

      const req = httpTesting.expectOne(`${environment.apiUrl}/students/STD-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
    });

    it('should create student via POST', () => {
      const dto = { firstName: 'Eric', lastName: 'Praveen', email: 'eric@example.com' };
      const createdStudent: Student = { id: 'STD-1', ...dto };

      service.createStudent(dto).subscribe(res => {
        expect(res.id).toBe('STD-1');
      });

      const req = httpTesting.expectOne(`${environment.apiUrl}/students`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);
      req.flush(createdStudent);
    });

    it('should update student via PUT', () => {
      const dto = { firstName: 'Updated', lastName: 'Praveen', email: 'updated@example.com' };
      const updatedStudent: Student = { id: 'STD-1', ...dto };

      service.updateStudent('STD-1', dto).subscribe(res => {
        expect(res.firstName).toBe('Updated');
      });

      const req = httpTesting.expectOne(`${environment.apiUrl}/students/STD-1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedStudent);
    });

    it('should delete student via DELETE', () => {
      service.deleteStudent('STD-1').subscribe();

      const req = httpTesting.expectOne(`${environment.apiUrl}/students/STD-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
