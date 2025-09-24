import { Injectable } from '@angular/core';

interface AccountLockInfo {
  attempts: number;
  lockedUntil?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginAttemptService {
  private lockStore: Record<string, AccountLockInfo> = {};
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  isLocked(user: string): boolean {
    const normalized = user.trim(); // no lowercase
    const info = this.lockStore[normalized];
    if (info?.lockedUntil && info.lockedUntil > Date.now()) return true;

    if (info?.lockedUntil && info.lockedUntil <= Date.now()) {
      delete this.lockStore[normalized];
    }
    return false;
  }

  recordFailure(user: string): string {
    const normalized = user.trim();
    const info = this.lockStore[normalized] = this.lockStore[normalized] || { attempts: 0 };
    info.attempts++;

    if (info.attempts >= this.MAX_ATTEMPTS) {
      info.lockedUntil = Date.now() + this.LOCK_DURATION;
      return 'Account is temporarily locked due to multiple failed attempts. Please try again after 24 hours.';
    }

    return `Invalid credentials. (${info.attempts}/${this.MAX_ATTEMPTS})`;
  }

  reset(user: string): void {
    const normalized = user.trim();
    delete this.lockStore[normalized];
  }
}
