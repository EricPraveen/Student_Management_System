import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  public show(type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, duration = 4500): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, title, message, duration };

    this._toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  public success(message: string, title: string = 'Success'): void {
    this.show('success', message, title);
  }

  public error(message: string, title: string = 'Error'): void {
    this.show('error', message, title, 6000);
  }

  public info(message: string, title: string = 'Notice'): void {
    this.show('info', message, title);
  }

  public warning(message: string, title: string = 'Warning'): void {
    this.show('warning', message, title);
  }

  public dismiss(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
