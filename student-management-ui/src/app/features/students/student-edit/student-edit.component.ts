import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../core/services/toast.service';
import { Student, UpdateStudentDto } from '../../../core/models/student.model';
import { SRI_LANKAN_PHONE_REGEX, addressValidator, dateOfBirthValidator } from '../../../core/validators/student.validators';

@Component({
  selector: 'app-student-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Breadcrumb & Header -->
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-1">
            <a routerLink="/students" class="hover:text-indigo-600 transition-colors">Students</a>
            <span>/</span>
            <span class="text-slate-800 font-bold">Edit Profile</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Edit Student Details
            @if (student(); as s) {
              <span class="text-xs sm:text-sm px-3 py-1 rounded-xl bg-indigo-100 text-indigo-700 font-mono font-bold border border-indigo-200">
                {{ s.id }}
              </span>
            }
          </h1>
          <p class="text-sm sm:text-base text-slate-600 mt-1 font-medium">
            Update this student's name, phone, address, or contact details.
          </p>
        </div>

        <a
          [routerLink]="student() ? ['/students', student()!.id] : ['/students']"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          &larr; Cancel & Back
        </a>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="rounded-3xl bg-white border border-slate-200 p-16 text-center shadow-sm">
          <div class="flex flex-col items-center gap-3">
            <svg class="animate-spin h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-sm font-bold text-slate-600">Loading student details...</p>
          </div>
        </div>
      }

      <!-- Load Error State -->
      @if (loadError()) {
        <div class="rounded-3xl bg-rose-50 border border-rose-200 p-6 flex items-start gap-4 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-rose-900">Student Not Found or Load Failed</h3>
            <p class="text-sm text-rose-700 mt-1 font-medium">{{ loadError() }}</p>
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
                Return to Directory
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Form Card -->
      @if (!isLoading() && !loadError()) {
        <!-- Submit Error Banner -->
        @if (generalError()) {
          <div class="rounded-3xl bg-rose-50 border border-rose-200 p-5 flex items-start gap-4">
            <svg class="w-6 h-6 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-rose-900 uppercase tracking-wide">Please check your input</h4>
              <p class="text-sm text-rose-700 mt-1 font-medium">{{ generalError() }}</p>
            </div>
          </div>
        }

        <div class="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-8">
          <form [formGroup]="studentForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Name Section (2 Columns) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  First Name <span class="text-rose-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('firstName'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('firstName')
                  }"
                />
                @if (isFieldInvalid('firstName')) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                    @if (studentForm.get('firstName')?.errors?.['required']) {
                      <p>First name is required.</p>
                    }
                    @if (studentForm.get('firstName')?.errors?.['minlength']) {
                      <p>First name must be at least 2 characters.</p>
                    }
                    @if (studentForm.get('firstName')?.errors?.['maxlength']) {
                      <p>First name cannot exceed 50 characters.</p>
                    }
                    @if (serverErrors()['firstName']) {
                      <p>{{ serverErrors()['firstName'][0] }}</p>
                    }
                  </div>
                }
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Last Name <span class="text-rose-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('lastName'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('lastName')
                  }"
                />
                @if (isFieldInvalid('lastName')) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                    @if (studentForm.get('lastName')?.errors?.['required']) {
                      <p>Last name is required.</p>
                    }
                    @if (studentForm.get('lastName')?.errors?.['minlength']) {
                      <p>Last name must be at least 2 characters.</p>
                    }
                    @if (studentForm.get('lastName')?.errors?.['maxlength']) {
                      <p>Last name cannot exceed 50 characters.</p>
                    }
                    @if (serverErrors()['lastName']) {
                      <p>{{ serverErrors()['lastName'][0] }}</p>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Email & Phone (2 Columns) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Email -->
              <div>
                <label for="email" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Email Address <span class="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('email'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('email')
                  }"
                />
                @if (isFieldInvalid('email')) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                    @if (studentForm.get('email')?.errors?.['required']) {
                      <p>Email is required.</p>
                    }
                    @if (studentForm.get('email')?.errors?.['email']) {
                      <p>Please enter a valid email address.</p>
                    }
                    @if (studentForm.get('email')?.errors?.['minlength']) {
                      <p>Email must be at least 5 characters.</p>
                    }
                    @if (studentForm.get('email')?.errors?.['maxlength']) {
                      <p>Email cannot exceed 254 characters.</p>
                    }
                    @if (serverErrors()['email']) {
                      <p>{{ serverErrors()['email'][0] }}</p>
                    }
                  </div>
                }
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Phone Number <span class="text-xs text-slate-500 font-medium">(Optional)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  formControlName="phone"
                  placeholder="e.g. 0771234567 or +94771234567"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('phone'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('phone')
                  }"
                />
                @if (isFieldInvalid('phone')) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                    @if (studentForm.get('phone')?.errors?.['pattern']) {
                      <p>Please enter a valid Sri Lankan mobile number (e.g. 0771234567 or +94771234567).</p>
                    }
                    @if (studentForm.get('phone')?.errors?.['maxlength']) {
                      <p>Phone cannot exceed 13 characters.</p>
                    }
                    @if (serverErrors()['phone']) {
                      <p>{{ serverErrors()['phone'][0] }}</p>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Date of Birth & Gender (2 Columns) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Date of Birth -->
              <div>
                <label for="dateOfBirth" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Date of Birth <span class="text-xs text-slate-500 font-medium">(Optional)</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  formControlName="dateOfBirth"
                  [max]="todayString"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('dateOfBirth'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('dateOfBirth')
                  }"
                />
                @if (isFieldInvalid('dateOfBirth')) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                    @if (studentForm.get('dateOfBirth')?.errors?.['futureDate']) {
                      <p>Date of birth cannot be in the future.</p>
                    }
                    @if (studentForm.get('dateOfBirth')?.errors?.['minDate']) {
                      <p>Date of birth must be after 1900-01-01.</p>
                    }
                    @if (serverErrors()['dateOfBirth']) {
                      <p>{{ serverErrors()['dateOfBirth'][0] }}</p>
                    }
                  </div>
                }
              </div>

              <!-- Gender -->
              <div>
                <label for="gender" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  Gender <span class="text-xs text-slate-500 font-medium">(Optional)</span>
                </label>
                <select
                  id="gender"
                  formControlName="gender"
                  class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70 cursor-pointer"
                  [ngClass]="{
                    'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('gender'),
                    'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('gender')
                  }"
                >
                  <option value="">Select Gender (Optional)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                @if (isFieldInvalid('gender') && serverErrors()['gender']) {
                  <div class="mt-1.5 text-sm font-semibold text-rose-600">
                    <p>{{ serverErrors()['gender'][0] }}</p>
                  </div>
                }
              </div>
            </div>

            <!-- Address (Full Width) -->
            <div>
              <label for="address" class="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                Home Address <span class="text-xs text-slate-500 font-medium">(Optional, 5–250 characters)</span>
              </label>
              <textarea
                id="address"
                rows="3"
                formControlName="address"
                class="w-full px-4 py-3 rounded-2xl border text-base text-slate-900 focus:outline-hidden focus:ring-2 transition-all bg-slate-50/70 resize-y"
                [ngClass]="{
                  'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500': isFieldInvalid('address'),
                  'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500': !isFieldInvalid('address')
                }"
              ></textarea>
              @if (isFieldInvalid('address')) {
                <div class="mt-1.5 text-sm font-semibold text-rose-600 space-y-0.5">
                  @if (studentForm.get('address')?.errors?.['whitespaceOnly']) {
                    <p>Address cannot contain only whitespace.</p>
                  }
                  @if (studentForm.get('address')?.errors?.['minLength'] || studentForm.get('address')?.errors?.['maxLength']) {
                    <p>Address must be between 5 and 250 characters.</p>
                  }
                  @if (serverErrors()['address']) {
                    <p>{{ serverErrors()['address'][0] }}</p>
                  }
                </div>
              }
            </div>

            <!-- Action Buttons -->
            <div class="pt-5 border-t border-slate-200 flex items-center justify-end gap-3.5">
              <a
                [routerLink]="['/students', studentId]"
                class="px-5 py-3 rounded-2xl border border-slate-200 text-sm sm:text-base font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </a>
              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                @if (isSubmitting()) {
                  <svg class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Student...
                } @else {
                  Save Changes
                }
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class StudentEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly studentService = inject(StudentService);
  private readonly toastService = inject(ToastService);

  public studentId = '';
  public readonly student = signal<Student | null>(null);
  public readonly isLoading = signal(true);
  public readonly loadError = signal<string | null>(null);
  public readonly isSubmitting = signal(false);
  public readonly generalError = signal<string | null>(null);
  public readonly serverErrors = signal<Record<string, string[]>>({});

  public readonly todayString = new Date().toISOString().split('T')[0];

  public readonly studentForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(5), Validators.maxLength(254)]],
    phone: ['', [Validators.maxLength(13), Validators.pattern(SRI_LANKAN_PHONE_REGEX)]],
    dateOfBirth: ['', [dateOfBirthValidator()]],
    gender: [''],
    address: ['', [addressValidator()]]
  });

  public ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.loadError.set('No student ID provided in route.');
      this.isLoading.set(false);
      return;
    }
    this.studentId = idParam;
    this.loadStudent();
  }

  public loadStudent(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.studentService.getStudentById(this.studentId).subscribe({
      next: (student) => {
        this.student.set(student);
        this.studentForm.patchValue({
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          email: student.email || '',
          phone: student.phone || '',
          dateOfBirth: student.dateOfBirth || '',
          gender: student.gender || '',
          address: student.address || ''
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = this.studentService.formatErrorMessage(err);
        this.loadError.set(msg);
        this.isLoading.set(false);
        this.toastService.error(msg, 'Load Failed');
      }
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.studentForm.get(fieldName);
    const hasClientError = !!(control && control.invalid && (control.dirty || control.touched));
    const hasServerError = !!(this.serverErrors()[fieldName]?.length);
    return hasClientError || hasServerError;
  }

  public onSubmit(): void {
    this.generalError.set(null);
    this.serverErrors.set({});

    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      this.toastService.warning('Please fix the validation errors before saving.');
      return;
    }

    const val = this.studentForm.value;

    const dto: UpdateStudentDto = {
      firstName: (val.firstName || '').trim(),
      lastName: (val.lastName || '').trim(),
      email: (val.email || '').trim().toLowerCase(),
      phone: val.phone?.trim() || null,
      dateOfBirth: val.dateOfBirth || null,
      gender: val.gender || null,
      address: val.address?.trim() || null
    };

    this.isSubmitting.set(true);

    this.studentService.updateStudent(this.studentId, dto).subscribe({
      next: (updated) => {
        this.isSubmitting.set(false);
        this.toastService.success(`Student ${updated.firstName} ${updated.lastName} updated successfully!`);
        this.router.navigate(['/students', this.studentId]);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const errMsg = this.studentService.formatErrorMessage(err);
        this.generalError.set(errMsg);
        this.serverErrors.set(this.studentService.extractValidationErrors(err));
        this.toastService.error(errMsg, 'Update Failed');
      }
    });
  }
}
