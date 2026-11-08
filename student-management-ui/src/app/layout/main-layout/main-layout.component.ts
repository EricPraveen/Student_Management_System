import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, ToastComponent],
  template: `
    <div class="min-h-screen flex bg-slate-50/60 font-sans antialiased text-slate-800">
      <!-- Global Toast Container -->
      <app-toast />

      <!-- Sidebar -->
      <app-sidebar
        [isOpen]="sidebarOpen"
        (closeSidebar)="sidebarOpen = false"
      />

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <!-- Top Navigation -->
        <app-header
          (toggleSidebar)="sidebarOpen = !sidebarOpen"
        />

        <!-- Page Dynamic View -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  public sidebarOpen = false;
}
