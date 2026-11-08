import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      <!-- Left side: Hamburger & Title / Breadcrumbs -->
      <div class="flex items-center gap-3.5 sm:gap-5">
        <!-- Mobile hamburger toggle -->
        <button
          type="button"
          (click)="toggleSidebar.emit()"
          class="p-2.5 -ml-1 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-2xl lg:hidden focus:outline-hidden cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Page Header Info -->
        <div>
          <nav aria-label="Breadcrumb" class="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-semibold mb-1">
            <a routerLink="/dashboard" class="hover:text-indigo-600 transition-colors">School Hub</a>
            <span class="text-slate-300">/</span>
            <span class="text-slate-800 capitalize font-bold">{{ currentSection }}</span>
          </nav>
          <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {{ pageTitle }}
          </h2>
        </div>
      </div>

      <!-- Right side: Quick Action & User Profile -->
      <div class="flex items-center gap-4 sm:gap-5">
        <!-- Add Student quick button -->
        <a
          routerLink="/students/create"
          class="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2.2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Student</span>
        </a>

        <!-- User Profile Placeholder -->
        <div class="flex items-center gap-3 pl-2 sm:pl-4 sm:border-l border-slate-200">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white text-sm font-extrabold shadow-sm ring-2 ring-indigo-100">
            EP
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-sm font-extrabold text-slate-900 leading-tight">Eric Praveen</p>
            <p class="text-xs font-semibold text-indigo-600 leading-tight mt-0.5">Administrator</p>
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
