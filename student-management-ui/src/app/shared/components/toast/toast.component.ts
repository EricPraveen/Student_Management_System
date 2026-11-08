import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      aria-live="polite"
      class="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto rounded-xl p-4 shadow-lg border backdrop-blur-sm transition-all duration-300 flex items-start gap-3 animate-in fade-in slide-in-from-top-4"
          [ngClass]="{
            'bg-emerald-50/95 border-emerald-200 text-emerald-900': toast.type === 'success',
            'bg-rose-50/95 border-rose-200 text-rose-900': toast.type === 'error',
            'bg-amber-50/95 border-amber-200 text-amber-900': toast.type === 'warning',
            'bg-slate-50/95 border-slate-200 text-slate-900': toast.type === 'info'
          }"
          role="alert"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            }
          </div>

          <!-- Content -->
          <div class="flex-1 text-sm">
            @if (toast.title) {
              <p class="font-semibold text-xs uppercase tracking-wider mb-0.5 opacity-90">{{ toast.title }}</p>
            }
            <p class="font-medium leading-relaxed">{{ toast.message }}</p>
          </div>

          <!-- Dismiss Button -->
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            aria-label="Dismiss toast"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  public readonly toastService = inject(ToastService);
}
