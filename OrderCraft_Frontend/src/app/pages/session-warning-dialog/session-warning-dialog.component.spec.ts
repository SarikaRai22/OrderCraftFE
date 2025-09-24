import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionWarningDialogComponent } from './session-warning-dialog.component';

describe('SessionWarningDialogComponent', () => {
  let component: SessionWarningDialogComponent;
  let fixture: ComponentFixture<SessionWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionWarningDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SessionWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
