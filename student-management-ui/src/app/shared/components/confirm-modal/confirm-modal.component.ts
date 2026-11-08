import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="'modal-title'"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          (click)="onCancel()"
        ></div>

        <!-- Center modal wrapper -->
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-100 p-6"
          >
            <!-- Warning Icon -->
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 border border-rose-100">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
              </svg>
            </div>

            <!-- Title & Message -->
            <div class="text-center">
              <h3 id="modal-title" class="text-lg font-bold text-slate-900 tracking-tight">
                {{ title }}
              </h3>
              <p class="mt-2 text-sm text-slate-500 leading-relaxed">
                {{ message }}
              </p>
              @if (itemName) {
                <div class="mt-3 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200/80 inline-block max-w-full truncate">
                  <span class="text-xs font-semibold text-slate-700 font-mono">{{ itemName }}</span>
                </div>
              }
              <p class="mt-3 text-xs text-rose-500 font-medium">
                This action is permanent and cannot be undone.
              </p>
            </div>

            <!-- Action buttons -->
            <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                [disabled]="isProcessing"
                (click)="onCancel()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-slate-300 disabled:opacity-50 transition-all cursor-pointer"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                [disabled]="isProcessing"
                (click)="onConfirm()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-5 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white shadow-xs hover:bg-rose-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer"
              >
                @if (isProcessing) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                } @else {
                  {{ confirmText }}
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() public isOpen = false;
  @Input() public title = 'Confirm Deletion';
  @Input() public message = 'Are you sure you want to proceed?';
  @Input() public itemName = '';
  @Input() public confirmText = 'Delete';
  @Input() public cancelText = 'Cancel';
  @Input() public isProcessing = false;

  @Output() public readonly confirmed = new EventEmitter<void>();
  @Output() public readonly cancelled = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  public handleEscape(): void {
    if (this.isOpen && !this.isProcessing) {
      this.onCancel();
    }
  }

  public onConfirm(): void {
    if (!this.isProcessing) {
      this.confirmed.emit();
    }
  }

  public onCancel(): void {
    if (!this.isProcessing) {
      this.cancelled.emit();
    }
  }
}
