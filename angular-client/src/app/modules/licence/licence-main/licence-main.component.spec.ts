import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceMainComponent } from './licence-main.component';

describe('LicenceMainComponent', () => {
  let component: LicenceMainComponent;
  let fixture: ComponentFixture<LicenceMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
