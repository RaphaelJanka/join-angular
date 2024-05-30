import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorage: Storage | undefined;

  constructor() {
    if (typeof window !== 'undefined') {
      this.localStorage = window.localStorage;
    }
  }

  get(key: string): string | null {
    if (this.localStorage) {
      return this.localStorage.getItem(key);
    }
    return null;
  }

  set(key: string, value: string): void {
    if (this.localStorage) {
      this.localStorage.setItem(key, value);
    }
  }

  remove(key: string): void {
    if (this.localStorage) {
      this.localStorage.removeItem(key);
    }
  }
}