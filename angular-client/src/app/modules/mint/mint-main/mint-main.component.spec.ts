import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintMainComponent } from './mint-main.component';

describe('MintMainComponent', () => {
  let component: MintMainComponent;
  let fixture: ComponentFixture<MintMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
