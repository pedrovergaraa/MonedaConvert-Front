import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCoinComponent } from './favorite-coin.component';

describe('FavoriteCoinComponent', () => {
  let component: FavoriteCoinComponent;
  let fixture: ComponentFixture<FavoriteCoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriteCoinComponent]
    });
    fixture = TestBed.createComponent(FavoriteCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
