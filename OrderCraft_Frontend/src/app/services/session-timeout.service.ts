import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer, interval, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionTimeoutService {
  private readonly SESSION_DURATION = 10 * 60 * 1000;
  private readonly WARNING_BEFORE = 30 * 1000;
  private timeoutSub!: Subscription;
  private warningSub!: Subscription;
  private countdownSub!: Subscription;

  private showWarningSubject = new BehaviorSubject<boolean>(false);
  showWarning$ = this.showWarningSubject.asObservable();

  private warningSubject = new BehaviorSubject<number>(this.WARNING_BEFORE / 1000);
  warning$ = this.warningSubject.asObservable();

  constructor(private router: Router, private ngZone: NgZone) {
    this.startWatcher();
  }

  private startWatcher() {
    this.ngZone.runOutsideAngular(() => {
      const activity$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'click'),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'scroll')
      );

      this.timeoutSub?.unsubscribe();
      this.warningSub?.unsubscribe();

      activity$.subscribe(() => this.resetTimers());
      this.resetTimers();
    });
  }

  private startTimers() {
    // Warning phase
    this.warningSub = timer(this.SESSION_DURATION - this.WARNING_BEFORE).subscribe(() => {
      this.triggerWarning(this.WARNING_BEFORE / 1000);

      let countdown = this.WARNING_BEFORE / 1000;
      this.countdownSub = interval(1000).subscribe(() => {
        countdown--;
        this.warningSubject.next(countdown);

        if (countdown <= 0) {
          this.countdownSub.unsubscribe();
          this.forceLogout();
        }
      });
    });

    // Final logout phase
    this.timeoutSub = timer(this.SESSION_DURATION).subscribe(() => {
      this.forceLogout();
    });
  }

  private resetTimers() {
    this.warningSub?.unsubscribe();
    this.timeoutSub?.unsubscribe();
    this.countdownSub?.unsubscribe();
    this.startTimers();
  }

  keepAlive() {
    this.resetTimers();
    this.showWarningSubject.next(false);
  }

  triggerWarning(countdown: number) {
    this.showWarningSubject.next(true);
    this.warningSubject.next(countdown);
  }

  forceLogout() {
    localStorage.clear();
    this.showWarningSubject.next(false);
    this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
  }

  logout() {
    this.forceLogout();
  }
}
