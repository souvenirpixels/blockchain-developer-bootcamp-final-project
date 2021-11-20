import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurnModalComponent } from './burn-modal.component';

describe('BurnModalComponent', () => {
  let component: BurnModalComponent;
  let fixture: ComponentFixture<BurnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurnModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
