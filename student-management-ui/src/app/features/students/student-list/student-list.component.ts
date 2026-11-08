import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { Student } from '../../../core/models/student.model';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            All Students
            <span class="text-sm font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 shadow-2xs">
              {{ students().length }} Total
            </span>
          </h1>
          <p class="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            Search, view, and manage all students enrolled in the school.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="loadStudents()"
            [disabled]="isLoading()"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Refresh List"
          >
            <svg class="w-4 h-4" [class.animate-spin]="isLoading()" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Refresh</span>
          </button>

          <a
            routerLink="/students/create"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Student</span>
          </a>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <!-- Live Search Input -->
        <div class="relative w-full md:max-w-md">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by student name, email, or ID..."
            class="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/70"
          />
          @if (searchQuery()) {
            <button
              type="button"
              (click)="searchQuery.set('')"
              class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <!-- Gender Filter Tabs -->
        <div class="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-full md:w-auto overflow-x-auto">
          @for (filter of genderFilters; track filter.value) {
            <button
              type="button"
              (click)="selectedGender.set(filter.value)"
              class="px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer"
              [ngClass]="{
                'bg-white text-indigo-700 shadow-sm': selectedGender() === filter.value,
                'text-slate-600 hover:text-slate-900': selectedGender() !== filter.value
              }"
            >
              {{ filter.label }}
            </button>
          }
        </div>
      </div>

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="rounded-3xl bg-rose-50 border border-rose-200 p-6 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-rose-900">Unable to load students</h3>
            <p class="text-sm text-rose-700 mt-1 font-medium">{{ errorMessage() }}</p>
            <button
              type="button"
              (click)="loadStudents()"
              class="mt-3.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      }

      <!-- Main Content / Table Area -->
      <div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <!-- Loading State -->
        @if (isLoading()) {
          <div class="p-8 space-y-4">
            <div class="flex items-center justify-center py-16">
              <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm font-bold text-slate-600">Loading student records...</p>
              </div>
            </div>
          </div>
        } @else if (!errorMessage()) {
          <!-- Empty Results State -->
          @if (filteredStudents().length === 0) {
            <div class="py-16 px-4 text-center">
              <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                🔍
              </div>
              @if (searchQuery() || selectedGender() !== 'all') {
                <h3 class="text-lg font-bold text-slate-800">No matching students found</h3>
                <p class="text-sm text-slate-600 mt-1 max-w-sm mx-auto font-medium">
                  We couldn't find anyone matching your search. Try typing something else or clear your filters.
                </p>
                <button
                  type="button"
                  (click)="resetFilters()"
                  class="mt-4 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              } @else {
                <h3 class="text-lg font-bold text-slate-800">No students registered yet</h3>
                <p class="text-sm text-slate-600 mt-1 max-w-sm mx-auto font-medium">
                  Your school registry is currently empty. Click the button below to add your first student!
                </p>
                <a
                  routerLink="/students/create"
                  class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors shadow-sm"
                >
                  + Add First Student
                </a>
              }
            </div>
          } @else {
            <!-- Students Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50/80 text-xs sm:text-sm font-bold text-slate-600 uppercase tracking-wider">
                    <th class="py-4 px-5 sm:px-6">Student ID</th>
                    <th class="py-4 px-5">Student Name</th>
                    <th class="py-4 px-5">Email Address</th>
                    <th class="py-4 px-5 hidden md:table-cell">Phone Number</th>
                    <th class="py-4 px-5 hidden lg:table-cell">Gender</th>
                    <th class="py-4 px-5 hidden lg:table-cell">Birthday</th>
                    <th class="py-4 px-5 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (student of paginatedStudents(); track student.id) {
                    <tr class="hover:bg-indigo-50/30 transition-colors group">
                      <!-- ID Column -->
                      <td class="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <span class="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs sm:text-sm font-bold border border-slate-200">
                          {{ student.id }}
                        </span>
                      </td>

                      <!-- Name & Avatar Column -->
                      <td class="py-4 px-5 whitespace-nowrap">
                        <div class="flex items-center gap-3.5">
                          <div class="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm shrink-0 shadow-2xs">
                            {{ student.firstName[0] || '?' }}{{ student.lastName[0] || '' }}
                          </div>
                          <div>
                            <p class="font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {{ student.firstName }} {{ student.lastName }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <!-- Email Column -->
                      <td class="py-4 px-5 whitespace-nowrap text-slate-700 text-sm font-medium">
                        {{ student.email }}
                      </td>

                      <!-- Phone Column -->
                      <td class="py-4 px-5 whitespace-nowrap hidden md:table-cell text-slate-700 text-sm font-medium">
                        {{ student.phone || '—' }}
                      </td>

                      <!-- Gender Column -->
                      <td class="py-4 px-5 whitespace-nowrap hidden lg:table-cell">
                        <span
                          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                          [ngClass]="{
                            'bg-blue-100 text-blue-800 border border-blue-200': student.gender?.toLowerCase() === 'male',
                            'bg-pink-100 text-pink-800 border border-pink-200': student.gender?.toLowerCase() === 'female',
                            'bg-slate-100 text-slate-700 border border-slate-200': !student.gender || student.gender.toLowerCase() === 'other'
                          }"
                        >
                          {{ student.gender || 'Not specified' }}
                        </span>
                      </td>

                      <!-- Date of Birth Column -->
                      <td class="py-4 px-5 whitespace-nowrap hidden lg:table-cell text-slate-700 text-sm font-medium">
                        {{ student.dateOfBirth || '—' }}
                      </td>

                      <!-- Actions Column -->
                      <td class="py-4 px-5 sm:px-6 whitespace-nowrap text-right">
                        <div class="inline-flex items-center gap-2 justify-end">
                          <!-- View Details Button -->
                          <a
                            [routerLink]="['/students', student.id]"
                            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <span>👁️</span>
                            <span>View</span>
                          </a>

                          <!-- Edit Button -->
                          <a
                            [routerLink]="['/students', student.id, 'edit']"
                            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer"
                            title="Edit Student"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </a>

                          <!-- Delete Button -->
                          <button
                            type="button"
                            (click)="promptDelete(student)"
                            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Table Pagination Controls -->
            @if (totalPages() > 1) {
              <div class="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                <span class="text-slate-600 font-medium">
                  Showing {{ ((currentPage() - 1) * pageSize) + 1 }} to {{ min(currentPage() * pageSize, filteredStudents().length) }} of {{ filteredStudents().length }} students
                </span>
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    (click)="currentPage.set(currentPage() - 1)"
                    [disabled]="currentPage() === 1"
                    class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    &larr; Previous
                  </button>
                  <span class="px-3 py-2 text-slate-800 font-bold">
                    Page {{ currentPage() }} of {{ totalPages() }}
                  </span>
                  <button
                    type="button"
                    (click)="currentPage.set(currentPage() + 1)"
                    [disabled]="currentPage() === totalPages()"
                    class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            }
          }
        }
      </div>
    </div>

    <!-- Delete Confirmation Modal Component -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen()"
      title="Delete Student Record"
      message="Are you sure you want to delete this student? Their record will be permanently removed from the school system."
      [itemName]="studentToDelete() ? studentToDelete()!.firstName + ' ' + studentToDelete()!.lastName + ' (' + studentToDelete()!.id + ')' : ''"
      confirmText="Yes, Delete Student"
      cancelText="No, Keep Student"
      [isProcessing]="isDeleting()"
      (confirmed)="executeDelete()"
      (cancelled)="isDeleteModalOpen.set(false)"
    />
  `
})
export class StudentListComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly toastService = inject(ToastService);

  public readonly students = signal<Student[]>([]);
  public readonly isLoading = signal(true);
  public readonly errorMessage = signal<string | null>(null);

  // Filters & Search
  public readonly searchQuery = signal('');
  public readonly selectedGender = signal('all');
  public readonly genderFilters = [
    { label: 'All Students', value: 'all' },
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  // Pagination
  public readonly currentPage = signal(1);
  public readonly pageSize = 10;

  // Delete modal state
  public readonly isDeleteModalOpen = signal(false);
  public readonly studentToDelete = signal<Student | null>(null);
  public readonly isDeleting = signal(false);

  // Filtered computed list
  public readonly filteredStudents = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const gender = this.selectedGender();

    return this.students().filter(student => {
      // Gender filter
      if (gender !== 'all') {
        const studentGender = (student.gender || '').trim().toLowerCase();
        if (gender === 'other') {
          if (studentGender === 'male' || studentGender === 'female') {
            return false;
          }
        } else if (studentGender !== gender) {
          return false;
        }
      }

      // Search query (name, email, student ID)
      if (query) {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const email = (student.email || '').toLowerCase();
        const id = (student.id || '').toLowerCase();

        return fullName.includes(query) || email.includes(query) || id.includes(query);
      }

      return true;
    });
  });

  public readonly totalPages = computed(() => {
    const total = this.filteredStudents().length;
    return Math.ceil(total / this.pageSize) || 1;
  });

  public readonly paginatedStudents = computed(() => {
    const list = this.filteredStudents();
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  public ngOnInit(): void {
    this.loadStudents();
  }

  public loadStudents(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = this.studentService.formatErrorMessage(err);
        this.errorMessage.set(msg);
        this.isLoading.set(false);
        this.toastService.error(msg, 'Load Failed');
      }
    });
  }

  public resetFilters(): void {
    this.searchQuery.set('');
    this.selectedGender.set('all');
    this.currentPage.set(1);
  }

  public promptDelete(student: Student): void {
    this.studentToDelete.set(student);
    this.isDeleteModalOpen.set(true);
  }

  public executeDelete(): void {
    const student = this.studentToDelete();
    if (!student) return;

    this.isDeleting.set(true);
    this.studentService.deleteStudent(student.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteModalOpen.set(false);
        this.students.update(list => list.filter(s => s.id !== student.id));
        this.toastService.success(`Student ${student.firstName} ${student.lastName} has been deleted.`);
      },
      error: (err) => {
        this.isDeleting.set(false);
        const msg = this.studentService.formatErrorMessage(err);
        this.toastService.error(msg, 'Deletion Failed');
      }
    });
  }

  public min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
