import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { Student, StudentStatistics } from '../../core/models/student.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 shadow-xl shadow-slate-950/10 border border-slate-800">
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-bold mb-4 border border-indigo-400/30">
            <span>✨</span>
            <span>School Hub Portal</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome to Student Hub! 👋
          </h1>
          <p class="mt-3 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
            Easily manage your students, check enrollment numbers, and add new students in just a few clicks. Everything is simple and clear.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3.5">
            <a
              routerLink="/students/create"
              class="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm sm:text-base font-bold shadow-lg shadow-indigo-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add New Student</span>
            </a>
            <a
              routerLink="/students"
              class="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white text-sm sm:text-base font-bold border border-slate-700 transition-all cursor-pointer"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span>View All Students</span>
            </a>
            <button
              type="button"
              (click)="loadDashboardData()"
              [disabled]="isLoading()"
              class="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <svg class="w-5 h-5" [class.animate-spin]="isLoading()" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="h-36 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs"></div>
          }
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="rounded-3xl bg-rose-50 border border-rose-200 p-6 flex items-start gap-4 shadow-sm">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-bold text-rose-900">Oops! Could not load student data</h3>
            <p class="text-sm text-rose-700 mt-1 font-medium">{{ errorMessage() }}</p>
            <button
              type="button"
              (click)="loadDashboardData()"
              class="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      }

      <!-- Statistics Cards Grid (calculated from actual data) -->
      @if (!isLoading() && !errorMessage()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Total Students -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-600">Total Students</span>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-xs">
                🎒
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{{ stats().total }}</span>
              <span class="text-sm text-slate-600 font-semibold">enrolled</span>
            </div>
            <div class="mt-3 flex items-center gap-2 text-sm text-indigo-700 font-bold">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All active records
            </div>
          </div>

          <!-- Male Students -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-600">Boys (Male)</span>
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shadow-xs">
                👦
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{{ stats().male }}</span>
              <span class="text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                {{ stats().malePercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" [style.width.%]="stats().malePercentage"></div>
            </div>
          </div>

          <!-- Female Students -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-600">Girls (Female)</span>
              <div class="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl shadow-xs">
                👧
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{{ stats().female }}</span>
              <span class="text-sm font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-800">
                {{ stats().femalePercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-pink-500 h-2.5 rounded-full transition-all duration-500" [style.width.%]="stats().femalePercentage"></div>
            </div>
          </div>

          <!-- Other / Unspecified -->
          <div class="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-sm font-bold text-slate-600">Other / Unspecified</span>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl shadow-xs">
                🌟
              </div>
            </div>
            <div class="mt-4 flex items-baseline justify-between">
              <span class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{{ stats().other }}</span>
              <span class="text-sm font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                {{ stats().otherPercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-amber-500 h-2.5 rounded-full transition-all duration-500" [style.width.%]="stats().otherPercentage"></div>
            </div>
          </div>
        </div>

        <!-- Two Column Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recently Added Students (2 columns) -->
          <div class="lg:col-span-2 rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-7">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h2 class="text-xl font-extrabold text-slate-900">Recently Enrolled Students</h2>
                <p class="text-sm text-slate-600 font-medium">Newest students added to your school</p>
              </div>
              <a
                routerLink="/students"
                class="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
              >
                <span>See All</span>
                <span>&rarr;</span>
              </a>
            </div>

            @if (recentStudents().length === 0) {
              <div class="py-12 text-center">
                <div class="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                  📚
                </div>
                <p class="text-base font-bold text-slate-800">No students added yet</p>
                <p class="text-sm text-slate-600 mt-1">Click the button below to register your very first student!</p>
                <a
                  routerLink="/students/create"
                  class="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <span>+ Add First Student</span>
                </a>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <th class="pb-3.5 pl-1">Student</th>
                      <th class="pb-3.5 hidden sm:table-cell">Gender</th>
                      <th class="pb-3.5 hidden md:table-cell">Email & Phone</th>
                      <th class="pb-3.5 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (student of recentStudents(); track student.id) {
                      <tr class="hover:bg-indigo-50/40 transition-colors group">
                        <td class="py-4 pl-1">
                          <div class="flex items-center gap-3.5">
                            <div class="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs">
                              {{ student.firstName[0] || '?' }}{{ student.lastName[0] || '' }}
                            </div>
                            <div class="min-w-0">
                              <p class="font-bold text-base text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                                {{ student.firstName }} {{ student.lastName }}
                              </p>
                              <p class="text-xs text-slate-600 font-mono font-semibold truncate">
                                ID: {{ student.id }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td class="py-4 hidden sm:table-cell">
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
                        <td class="py-4 hidden md:table-cell">
                          <p class="text-sm font-semibold text-slate-800 truncate">{{ student.email }}</p>
                          <p class="text-xs text-slate-600 font-medium">{{ student.phone || 'No phone number' }}</p>
                        </td>
                        <td class="py-4 text-right pr-2">
                          <a
                            [routerLink]="['/students', student.id]"
                            class="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                          >
                            View &rarr;
                          </a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Quick Actions & Helpful Guide (1 column) -->
          <div class="space-y-6">
            <!-- Quick Actions Card -->
            <div class="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 sm:p-7">
              <h2 class="text-lg font-extrabold text-slate-900 mb-4">Quick Shortcuts</h2>
              <div class="space-y-3">
                <a
                  routerLink="/students/create"
                  class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-base font-bold text-slate-800 group cursor-pointer"
                >
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      ➕
                    </div>
                    <span>Add New Student</span>
                  </div>
                  <span class="text-slate-400 group-hover:text-indigo-600 text-lg">&rarr;</span>
                </a>

                <a
                  routerLink="/students"
                  class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-base font-bold text-slate-800 group cursor-pointer"
                >
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      📋
                    </div>
                    <span>View All Students</span>
                  </div>
                  <span class="text-slate-400 group-hover:text-slate-800 text-lg">&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Helpful Guide Card (Easy for everyone & children to understand) -->
            <div class="rounded-3xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-purple-50/60 border border-indigo-100 p-6 sm:p-7">
              <div class="flex items-center gap-2.5 mb-3">
                <span class="text-2xl">💡</span>
                <h3 class="text-base font-extrabold text-indigo-950">Helpful School Tips</h3>
              </div>
              <ul class="space-y-3 text-sm text-slate-700 font-medium">
                <li class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold mt-0.5">•</span>
                  <span><strong>Student ID:</strong> Every student gets a special ID so they can be identified easily.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold mt-0.5">•</span>
                  <span><strong>Contact Info:</strong> Keep phone numbers and emails accurate for school notifications.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-indigo-600 font-bold mt-0.5">•</span>
                  <span><strong>Edit Anytime:</strong> Click on any student to update their address, phone, or grade details.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly toastService = inject(ToastService);

  public readonly isLoading = signal(true);
  public readonly errorMessage = signal<string | null>(null);
  public readonly stats = signal<StudentStatistics>({
    total: 0,
    male: 0,
    female: 0,
    other: 0,
    malePercentage: 0,
    femalePercentage: 0,
    otherPercentage: 0
  });
  public readonly recentStudents = signal<Student[]>([]);

  public ngOnInit(): void {
    this.loadDashboardData();
  }

  public loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.stats.set(this.studentService.calculateStatistics(students));
        // Show up to 5 recent students (latest records)
        const sorted = [...students].reverse().slice(0, 5);
        this.recentStudents.set(sorted);
        this.isLoading.set(false);
      },
      error: (err) => {
        const msg = this.studentService.formatErrorMessage(err);
        this.errorMessage.set(msg);
        this.isLoading.set(false);
        this.toastService.error(msg, 'Dashboard Error');
      }
    });
  }
}
