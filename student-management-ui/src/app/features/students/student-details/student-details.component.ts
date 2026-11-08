import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../core/services/toast.service';
import { Student } from '../../../core/models/student.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Top Navigation & Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <a routerLink="/students" class="hover:text-indigo-600 transition-colors">Students</a>
          <span>/</span>
          <span class="text-slate-800 font-bold">Student Profile</span>
        </div>

        <div class="flex items-center gap-3">
          <a
            routerLink="/students"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            &larr; Back to All Students
          </a>
          @if (student(); as s) {
            <a
              [routerLink]="['/students', s.id, 'edit']"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              <span>Edit Details</span>
            </a>
            <button
              type="button"
              (click)="isDeleteModalOpen.set(true)"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-bold transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              <span>Delete</span>
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="rounded-3xl bg-white border border-slate-200 p-16 text-center shadow-sm">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm font-bold text-slate-600">Loading student profile...</p>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="rounded-3xl bg-rose-50 border border-rose-200 p-6 flex items-start gap-4 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-rose-900">Student Record Not Found</h3>
            <p class="text-sm text-rose-700 mt-1 font-medium">{{ errorMessage() }}</p>
            <div class="mt-4 flex gap-3">
              <button
                type="button"
                (click)="loadStudent()"
                class="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <a
                routerLink="/students"
                class="px-4 py-2 rounded-xl border border-rose-200 bg-white text-rose-700 text-sm font-bold hover:bg-rose-50 transition-colors"
              >
                Back to All Students
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Student Profile Card -->
      @if (student(); as s) {
        <!-- Hero Profile Header Card -->
        <div class="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 relative">
            <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div class="px-6 sm:px-8 pb-8 pt-0 relative">
            <div class="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 sm:-mt-16 mb-6 gap-4">
              <div class="flex items-end gap-4">
                <div class="w-28 h-28 rounded-3xl bg-white p-1.5 shadow-lg border border-slate-100 shrink-0">
                  <div class="w-full h-full rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center text-3xl font-black shadow-inner">
                    {{ s.firstName[0] || '?' }}{{ s.lastName[0] || '' }}
                  </div>
                </div>
                <div class="mb-1">
                  <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {{ s.firstName }} {{ s.lastName }}
                  </h1>
                  <p class="text-sm text-slate-500 font-mono font-bold mt-0.5">
                    ID: {{ s.id }}
                  </p>
                </div>
              </div>

              <div>
                <span
                  class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-2xs"
                  [ngClass]="{
                    'bg-blue-100 text-blue-800 border border-blue-200': s.gender?.toLowerCase() === 'male',
                    'bg-pink-100 text-pink-800 border border-pink-200': s.gender?.toLowerCase() === 'female',
                    'bg-slate-100 text-slate-800 border border-slate-200': !s.gender || s.gender.toLowerCase() === 'other'
                  }"
                >
                  <span class="w-2.5 h-2.5 rounded-full mr-2"
                    [ngClass]="{
                      'bg-blue-600': s.gender?.toLowerCase() === 'male',
                      'bg-pink-500': s.gender?.toLowerCase() === 'female',
                      'bg-slate-500': !s.gender || s.gender.toLowerCase() === 'other'
                    }"
                  ></span>
                  {{ s.gender || 'Gender Not Specified' }}
                </span>
              </div>
            </div>

            <!-- Profile Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-200">
              <!-- Personal Information Box -->
              <div class="space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Personal Information
                </h2>

                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3.5">
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Full Name</span>
                    <span class="text-base font-bold text-slate-900">{{ s.firstName }} {{ s.lastName }}</span>
                  </div>
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Birthday (Date of Birth)</span>
                    <span class="text-base font-bold text-slate-900">{{ s.dateOfBirth || 'Not provided' }}</span>
                  </div>
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Gender</span>
                    <span class="text-base font-bold text-slate-900">{{ s.gender || 'Not specified' }}</span>
                  </div>
                </div>
              </div>

              <!-- Contact Information Box -->
              <div class="space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Contact Information
                </h2>

                <div class="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3.5">
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Email Address</span>
                    <span class="text-base font-bold text-indigo-700">{{ s.email }}</span>
                  </div>
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Phone Number</span>
                    <span class="text-base font-bold text-slate-900">{{ s.phone || 'Not provided' }}</span>
                  </div>
                  <div>
                    <span class="text-xs sm:text-sm text-slate-500 font-semibold block">Home Address</span>
                    <span class="text-base font-bold text-slate-900 leading-relaxed">{{ s.address || 'Not provided' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Record Info Footer -->
            <div class="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="font-semibold text-slate-500 block mb-0.5 text-xs">Student ID</span>
                <span class="font-mono font-bold text-slate-800 text-sm truncate block">{{ s.id }}</span>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="font-semibold text-slate-500 block mb-0.5 text-xs">Date Enrolled</span>
                <span class="font-bold text-slate-800 text-sm block">{{ formatTimestamp(s.createdAt) }}</span>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span class="font-semibold text-slate-500 block mb-0.5 text-xs">Last Updated</span>
                <span class="font-bold text-slate-800 text-sm block">{{ formatTimestamp(s.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Confirm Modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen()"
      title="Delete Student Record"
      message="Are you sure you want to delete this student? Their record will be permanently deleted from the school system."
      [itemName]="student() ? student()!.firstName + ' ' + student()!.lastName + ' (' + student()!.id + ')' : ''"
      confirmText="Yes, Delete Student"
      cancelText="No, Keep Student"
      [isProcessing]="isDeleting()"
      (confirmed)="executeDelete()"
      (cancelled)="isDeleteModalOpen.set(false)"
    />
  `
})
export class StudentDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);
  private readonly toastService = inject(ToastService);

  public studentId = '';
  public readonly student = signal<Student | null>(null);
  public readonly isLoading = signal(true);
  public readonly errorMessage = signal<string | null>(null);

  public readonly isDeleteModalOpen = signal(false);
  public readonly isDeleting = signal(false);

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage.set('Student ID is missing from route.');
      this.isLoading.set(false);
      return;
    }
    this.studentId = id;
    this.loadStudent();
  }

  public loadStudent(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (data) => {
        this.student.set(data);
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

  public executeDelete(): void {
    const s = this.student();
    if (!s) return;

    this.isDeleting.set(true);
    this.studentService.deleteStudent(s.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.isDeleteModalOpen.set(false);
        this.toastService.success(`Student ${s.firstName} ${s.lastName} has been deleted.`);
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.isDeleting.set(false);
        const msg = this.studentService.formatErrorMessage(err);
        this.toastService.error(msg, 'Deletion Failed');
      }
    });
  }

  public formatTimestamp(ts?: string | null): string {
    if (!ts) return 'Not available';
    try {
      const date = new Date(ts);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return ts;
    }
  }
}
