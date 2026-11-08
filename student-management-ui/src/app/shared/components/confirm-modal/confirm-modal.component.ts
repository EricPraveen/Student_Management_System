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
            class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-100 p-7"
          >
            <!-- Warning Icon -->
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5 border border-rose-100 text-3xl">
              🗑️
            </div>

            <!-- Title & Message -->
            <div class="text-center">
              <h3 id="modal-title" class="text-xl font-extrabold text-slate-900 tracking-tight">
                {{ title }}
              </h3>
              <p class="mt-2 text-base text-slate-600 leading-relaxed font-medium">
                {{ message }}
              </p>
              @if (itemName) {
                <div class="mt-3.5 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 inline-block max-w-full truncate">
                  <span class="text-sm font-bold text-slate-800 font-mono">{{ itemName }}</span>
                </div>
              }
              <p class="mt-3 text-xs sm:text-sm text-rose-600 font-bold">
                Note: This student will be removed and cannot be restored.
              </p>
            </div>

            <!-- Action buttons -->
            <div class="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                [disabled]="isProcessing"
                (click)="onCancel()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 rounded-2xl border border-slate-200 bg-white text-base font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                [disabled]="isProcessing"
                (click)="onConfirm()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-2xl bg-rose-600 text-base font-bold text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer disabled:opacity-50"
              >
                @if (isProcessing) {
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
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
