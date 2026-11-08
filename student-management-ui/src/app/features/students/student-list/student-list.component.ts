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
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            Student Directory
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {{ students().length }} Total
            </span>
          </h1>
          <p class="text-xs text-slate-600 mt-1">
            Browse, search, edit and manage verified student admissions
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            (click)="loadStudents()"
            [disabled]="isLoading()"
            class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh List"
          >
            <svg class="w-4 h-4" [class.animate-spin]="isLoading()" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <span>Refresh</span>
          </button>

          <a
            routerLink="/students/create"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add Student</span>
          </a>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <!-- Live Search Input -->
        <div class="relative w-full md:max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search by name, email, or student ID..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
          @if (searchQuery()) {
            <button
              type="button"
              (click)="searchQuery.set('')"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          }
        </div>

        <!-- Gender Filter Tabs -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          @for (filter of genderFilters; track filter.value) {
            <button
              type="button"
              (click)="selectedGender.set(filter.value)"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer"
              [ngClass]="{
                'bg-white text-slate-900 shadow-2xs': selectedGender() === filter.value,
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
        <div class="rounded-2xl bg-rose-50 border border-rose-200 p-6 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-bold text-rose-900">Unable to load students</h3>
            <p class="text-xs text-rose-700 mt-1 leading-relaxed">{{ errorMessage() }}</p>
            <button
              type="button"
              (click)="loadStudents()"
              class="mt-3.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      }

      <!-- Main Content / Table Area -->
      <div class="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <!-- Loading State -->
        @if (isLoading()) {
          <div class="p-8 space-y-4">
            <div class="flex items-center justify-center py-12">
              <div class="flex flex-col items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-xs font-semibold text-slate-500">Retrieving student records from PostgreSQL database...</p>
              </div>
            </div>
          </div>
        } @else if (!errorMessage()) {
          <!-- Empty Results State -->
          @if (filteredStudents().length === 0) {
            <div class="py-16 px-4 text-center">
              <div class="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3.5">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                </svg>
              </div>
              @if (searchQuery() || selectedGender() !== 'all') {
                <h3 class="text-sm font-bold text-slate-800">No matching students found</h3>
                <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No records match your search query or filter. Try clearing your filters.
                </p>
                <button
                  type="button"
                  (click)="resetFilters()"
                  class="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              } @else {
                <h3 class="text-sm font-bold text-slate-800">No students registered yet</h3>
                <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  The registry is currently empty. Register a student to populate the system.
                </p>
                <a
                  routerLink="/students/create"
                  class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                >
                  Add First Student
                </a>
              }
            </div>
          } @else {
            <!-- Students Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-sm">
                <thead>
                  <tr class="border-b border-slate-200/80 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th class="py-3.5 px-4 sm:px-6">Student ID</th>
                    <th class="py-3.5 px-4">Full Name</th>
                    <th class="py-3.5 px-4">Email</th>
                    <th class="py-3.5 px-4 hidden md:table-cell">Phone</th>
                    <th class="py-3.5 px-4 hidden lg:table-cell">Gender</th>
                    <th class="py-3.5 px-4 hidden lg:table-cell">Date of Birth</th>
                    <th class="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (student of paginatedStudents(); track student.id) {
                    <tr class="hover:bg-slate-50/80 transition-colors group">
                      <!-- ID Column -->
                      <td class="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-medium border border-slate-200/70">
                          {{ student.id }}
                        </span>
                      </td>

                      <!-- Name & Avatar Column -->
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {{ student.firstName[0] || '?' }}{{ student.lastName[0] || '' }}
                          </div>
                          <div>
                            <p class="font-semibold text-slate-900 leading-tight">
                              {{ student.firstName }} {{ student.lastName }}
                            </p>
                          </div>
                        </div>
                      </td>

                      <!-- Email Column -->
                      <td class="py-3.5 px-4 whitespace-nowrap text-slate-600 text-xs font-medium">
                        {{ student.email }}
                      </td>

                      <!-- Phone Column -->
                      <td class="py-3.5 px-4 whitespace-nowrap hidden md:table-cell text-slate-600 text-xs">
                        {{ student.phone || '—' }}
                      </td>

                      <!-- Gender Column -->
                      <td class="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell">
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                          [ngClass]="{
                            'bg-blue-50 text-blue-700 border border-blue-200/60': student.gender?.toLowerCase() === 'male',
                            'bg-pink-50 text-pink-700 border border-pink-200/60': student.gender?.toLowerCase() === 'female',
                            'bg-slate-100 text-slate-700 border border-slate-200': !student.gender || student.gender.toLowerCase() === 'other'
                          }"
                        >
                          {{ student.gender || 'Not specified' }}
                        </span>
                      </td>

                      <!-- Date of Birth Column -->
                      <td class="py-3.5 px-4 whitespace-nowrap hidden lg:table-cell text-slate-600 text-xs">
                        {{ student.dateOfBirth || '—' }}
                      </td>

                      <!-- Actions Column -->
                      <td class="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <div class="inline-flex items-center gap-1.5 justify-end">
                          <!-- View Details Button -->
                          <a
                            [routerLink]="['/students', student.id]"
                            class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                          </a>

                          <!-- Edit Button -->
                          <a
                            [routerLink]="['/students', student.id, 'edit']"
                            class="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Student"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </a>

                          <!-- Delete Button -->
                          <button
                            type="button"
                            (click)="promptDelete(student)"
                            class="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Student"
                          >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
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
              <div class="px-6 py-4 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span class="text-slate-600 font-medium">
                  Showing {{ ((currentPage() - 1) * pageSize) + 1 }} to {{ min(currentPage() * pageSize, filteredStudents().length) }} of {{ filteredStudents().length }} students
                </span>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    (click)="currentPage.set(currentPage() - 1)"
                    [disabled]="currentPage() === 1"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span class="px-3 py-1.5 text-slate-700 font-semibold">
                    Page {{ currentPage() }} of {{ totalPages() }}
                  </span>
                  <button
                    type="button"
                    (click)="currentPage.set(currentPage() + 1)"
                    [disabled]="currentPage() === totalPages()"
                    class="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Next
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
      message="Are you sure you want to delete this student? All records associated with this ID will be permanently removed from Supabase PostgreSQL."
      [itemName]="studentToDelete() ? studentToDelete()!.firstName + ' ' + studentToDelete()!.lastName + ' (' + studentToDelete()!.id + ')' : ''"
      confirmText="Yes, Delete Student"
      cancelText="Cancel"
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
