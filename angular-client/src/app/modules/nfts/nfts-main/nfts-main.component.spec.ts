import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftsMainComponent } from './nfts-main.component';

describe('NftsMainComponent', () => {
  let component: NftsMainComponent;
  let fixture: ComponentFixture<NftsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NftsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NftsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
