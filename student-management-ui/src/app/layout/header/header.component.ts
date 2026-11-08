import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="h-18 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs backdrop-blur-xs bg-white/95">
      <!-- Left side: Hamburger & Title / Breadcrumbs -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Mobile hamburger toggle -->
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden focus:outline-hidden"
          aria-label="Toggle Navigation"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Page Header Info -->
        <div>
          <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-0.5">
            <a routerLink="/dashboard" class="hover:text-indigo-600 transition-colors">Portal</a>
            <span class="text-slate-300">/</span>
            <span class="text-slate-700 capitalize">{{ currentSection }}</span>
          </nav>
          <h2 class="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {{ pageTitle }}
          </h2>
        </div>
      </div>

      <!-- Right side: Quick Action & User Profile -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Add Student quick button -->
        <a
          routerLink="/students/create"
          class="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 text-xs font-semibold transition-all border border-indigo-200/60"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>New Student</span>
        </a>

        <!-- User Profile Placeholder -->
        <div class="flex items-center gap-3 pl-2 sm:pl-3 sm:border-l border-slate-200">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            EP
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 leading-tight">Eric Praveen</p>
            <p class="text-[11px] font-medium text-slate-600 leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() public readonly toggleSidebar = new EventEmitter<void>();

  private readonly router = inject(Router);

  public pageTitle = 'Dashboard';
  public currentSection = 'Overview';

  constructor() {
    this.updateTitle(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateTitle(event.urlAfterRedirects || event.url);
      });
  }

  private updateTitle(url: string): void {
    if (url.includes('/students/create')) {
      this.pageTitle = 'Register Student';
      this.currentSection = 'Students / Add';
    } else if (url.includes('/edit')) {
      this.pageTitle = 'Edit Student';
      this.currentSection = 'Students / Modify';
    } else if (url.includes('/students/')) {
      this.pageTitle = 'Student Details';
      this.currentSection = 'Students / Profile';
    } else if (url.includes('/students')) {
      this.pageTitle = 'Student Directory';
      this.currentSection = 'Management';
    } else {
      this.pageTitle = 'Dashboard Overview';
      this.currentSection = 'Analytics';
    }
  }
}
