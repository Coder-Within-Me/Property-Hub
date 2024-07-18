import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBuyOrRentComponent } from './dialog-buy-or-rent.component';

describe('DialogBuyOrRentComponent', () => {
  let component: DialogBuyOrRentComponent;
  let fixture: ComponentFixture<DialogBuyOrRentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBuyOrRentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogBuyOrRentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
