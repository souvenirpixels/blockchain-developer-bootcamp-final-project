import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLicencesMainComponent } from './my-licences-main.component';

describe('MyLicencesMainComponent', () => {
  let component: MyLicencesMainComponent;
  let fixture: ComponentFixture<MyLicencesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyLicencesMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLicencesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
