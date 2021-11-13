import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNftsMainComponent } from './my-nfts-main.component';

describe('MyNftsMainComponent', () => {
  let component: MyNftsMainComponent;
  let fixture: ComponentFixture<MyNftsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyNftsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNftsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
