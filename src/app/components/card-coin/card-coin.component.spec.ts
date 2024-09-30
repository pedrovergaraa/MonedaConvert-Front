import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCoinComponent } from './card-coin.component';

describe('CardCoinComponent', () => {
  let component: CardCoinComponent;
  let fixture: ComponentFixture<CardCoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardCoinComponent]
    });
    fixture = TestBed.createComponent(CardCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
