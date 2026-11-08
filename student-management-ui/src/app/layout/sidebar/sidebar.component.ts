import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile backdrop -->
    @if (isOpen) {
      <div
        class="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        (click)="closeSidebar.emit()"
      ></div>
    }

    <!-- Sidebar sidebar container -->
    <aside
      class="fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-screen lg:shrink-0"
      [class.-translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen"
    >
      <!-- Brand Header -->
      <div class="h-18 flex items-center justify-between px-6 border-b border-slate-800/80">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <h1 class="font-bold text-base tracking-tight leading-tight text-white flex items-center gap-1.5">
              FutureTech <span class="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-medium">SMS</span>
            </h1>
            <p class="text-[11px] text-indigo-300/80 font-medium tracking-wide truncate">
              Bring Future Through Tech
            </p>
          </div>
        </div>

        <!-- Mobile close button -->
        <button
          type="button"
          (click)="closeSidebar.emit()"
          class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Close sidebar"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Section -->
      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div class="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Main Menu
        </div>

        <!-- Dashboard Link -->
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-indigo-600/20 text-indigo-300 font-semibold border-indigo-500 shadow-xs"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="onNavClick()"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-sm font-medium border-l-3 border-transparent"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          <span>Dashboard</span>
        </a>

        <!-- Students Link -->
        <a
          routerLink="/students"
          routerLinkActive="bg-indigo-600/20 text-indigo-300 font-semibold border-indigo-500 shadow-xs"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="onNavClick()"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-sm font-medium border-l-3 border-transparent"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <span>All Students</span>
        </a>

        <!-- Add Student Link -->
        <a
          routerLink="/students/create"
          routerLinkActive="bg-indigo-600/20 text-indigo-300 font-semibold border-indigo-500 shadow-xs"
          [routerLinkActiveOptions]="{ exact: true }"
          (click)="onNavClick()"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-sm font-medium border-l-3 border-transparent"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
          </svg>
          <span>Register Student</span>
        </a>
      </nav>

      <!-- System Status Footer -->
      <div class="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-400 font-medium">API Server</span>
            <span class="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Connected
            </span>
          </div>
          <p class="text-[11px] text-slate-400/80 truncate">
            ASP.NET Core .NET 10
          </p>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() public isOpen = false;
  @Output() public readonly closeSidebar = new EventEmitter<void>();

  public onNavClick(): void {
    this.closeSidebar.emit();
  }
}
