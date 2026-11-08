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
    <div class="space-y-6">
      <!-- Welcome Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-slate-950/10 border border-slate-800">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <span class="w-2 h-2 rounded-full bg-indigo-400"></span>
            Theme: Bring Future Through Tech
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Management Dashboard
          </h1>
          <p class="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Centralized platform for student admissions, records, and demographic analytics powered by modern cloud architecture.
          </p>
          <div class="mt-5 flex flex-wrap gap-3">
            <a
              routerLink="/students/create"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Register New Student
            </a>
            <a
              routerLink="/students"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              View All Students
            </a>
            <button
              type="button"
              (click)="loadDashboardData()"
              [disabled]="isLoading()"
              class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Data"
            >
              <svg class="w-4 h-4" [class.animate-spin]="isLoading()" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          @for (i of [1, 2, 3, 4]; track i) {
            <div class="h-32 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-2xs"></div>
          }
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="rounded-2xl bg-rose-50 border border-rose-200 p-5 flex items-start gap-3">
          <svg class="w-6 h-6 text-rose-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-bold text-rose-900">Failed to load statistics</h3>
            <p class="text-xs text-rose-700 mt-1">{{ errorMessage() }}</p>
            <button
              type="button"
              (click)="loadDashboardData()"
              class="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      }

      <!-- Statistics Cards Grid (calculated from actual data) -->
      @if (!isLoading() && !errorMessage()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <!-- Total Students -->
          <div class="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Enrolled</span>
              <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-slate-900">{{ stats().total }}</span>
              <span class="text-xs text-slate-600 font-medium">Students</span>
            </div>
            <div class="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
              Live records from database
            </div>
          </div>

          <!-- Male Students -->
          <div class="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">Male Students</span>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-slate-900">{{ stats().male }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {{ stats().malePercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-blue-600 h-1.5 rounded-full" [style.width.%]="stats().malePercentage"></div>
            </div>
          </div>

          <!-- Female Students -->
          <div class="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">Female Students</span>
              <div class="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-slate-900">{{ stats().female }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700">
                {{ stats().femalePercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-pink-600 h-1.5 rounded-full" [style.width.%]="stats().femalePercentage"></div>
            </div>
          </div>

          <!-- Other / Unspecified -->
          <div class="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">Other / Unspecified</span>
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <div class="mt-4 flex items-baseline gap-2">
              <span class="text-3xl font-extrabold text-slate-900">{{ stats().other }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                {{ stats().otherPercentage }}%
              </span>
            </div>
            <div class="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div class="bg-amber-600 h-1.5 rounded-full" [style.width.%]="stats().otherPercentage"></div>
            </div>
          </div>
        </div>

        <!-- Two Column Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Recently Added Students (2 columns) -->
          <div class="lg:col-span-2 rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-base font-bold text-slate-900">Recently Enrolled Students</h2>
                <p class="text-xs text-slate-600">Latest students added to the registry</p>
              </div>
              <a
                routerLink="/students"
                class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                View Directory &rarr;
              </a>
            </div>

            @if (recentStudents().length === 0) {
              <div class="py-12 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
                  </svg>
                </div>
                <p class="text-sm font-semibold text-slate-700">No student records yet</p>
                <p class="text-xs text-slate-600 mt-1">Get started by registering your first student.</p>
                <a
                  routerLink="/students/create"
                  class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Register First Student
                </a>
              </div>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <th class="pb-3 pl-1">Student</th>
                      <th class="pb-3 hidden sm:table-cell">Gender</th>
                      <th class="pb-3 hidden md:table-cell">Contact</th>
                      <th class="pb-3 text-right pr-1">Action</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (student of recentStudents(); track student.id) {
                      <tr class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-3 pl-1">
                          <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                              {{ student.firstName[0] || '?' }}{{ student.lastName[0] || '' }}
                            </div>
                            <div class="min-w-0">
                              <p class="font-semibold text-slate-900 truncate">
                                {{ student.firstName }} {{ student.lastName }}
                              </p>
                              <p class="text-xs text-slate-600 font-mono truncate">
                                {{ student.id }}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td class="py-3 hidden sm:table-cell">
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                            [ngClass]="{
                              'bg-blue-50 text-blue-700 border border-blue-200/60': student.gender?.toLowerCase() === 'male',
                              'bg-pink-50 text-pink-700 border border-pink-200/60': student.gender?.toLowerCase() === 'female',
                              'bg-slate-100 text-slate-700 border border-slate-200': !student.gender || student.gender.toLowerCase() === 'other'
                            }"
                          >
                            {{ student.gender || 'Not specified' }}
                          </span>
                        </td>
                        <td class="py-3 hidden md:table-cell">
                          <p class="text-xs text-slate-700 truncate">{{ student.email }}</p>
                          <p class="text-[11px] text-slate-600">{{ student.phone || 'No phone' }}</p>
                        </td>
                        <td class="py-3 text-right pr-1">
                          <a
                            [routerLink]="['/students', student.id]"
                            class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-colors"
                          >
                            Details
                          </a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <!-- Quick Actions & System Info (1 column) -->
          <div class="space-y-6">
            <!-- Quick Actions Card -->
            <div class="rounded-2xl bg-white border border-slate-200/80 shadow-xs p-6">
              <h2 class="text-base font-bold text-slate-900 mb-4">Quick Operations</h2>
              <div class="space-y-2.5">
                <a
                  routerLink="/students/create"
                  class="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm font-semibold text-slate-800 group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </div>
                    <span>Register Student</span>
                  </div>
                  <span class="text-slate-400 group-hover:text-indigo-600">&rarr;</span>
                </a>

                <a
                  routerLink="/students"
                  class="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm font-semibold text-slate-800 group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    </div>
                    <span>Search Registry</span>
                  </div>
                  <span class="text-slate-400 group-hover:text-slate-700">&rarr;</span>
                </a>
              </div>
            </div>

            <!-- Architecture Info Card -->
            <div class="rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100/80 p-6">
              <h3 class="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-2">Technical Foundation</h3>
              <p class="text-xs text-slate-600 leading-relaxed mb-4">
                Enterprise architecture combining ASP.NET Core Web API, PostgreSQL on Supabase, and Angular 22 with Tailwind CSS.
              </p>
              <div class="space-y-1.5 text-[11px] text-slate-600">
                <div class="flex justify-between py-1 border-b border-indigo-100/50">
                  <span class="font-medium">Backend Framework</span>
                  <span class="font-semibold text-slate-800">.NET 10 Web API</span>
                </div>
                <div class="flex justify-between py-1 border-b border-indigo-100/50">
                  <span class="font-medium">ORM / Database</span>
                  <span class="font-semibold text-slate-800">EF Core / PostgreSQL</span>
                </div>
                <div class="flex justify-between py-1 border-b border-indigo-100/50">
                  <span class="font-medium">Frontend Framework</span>
                  <span class="font-semibold text-slate-800">Angular 22 Standalone</span>
                </div>
                <div class="flex justify-between py-1">
                  <span class="font-medium">Styling Engine</span>
                  <span class="font-semibold text-slate-800">Tailwind CSS 4</span>
                </div>
              </div>
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
