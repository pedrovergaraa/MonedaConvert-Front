import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCoinComponent } from './create-coin.component';

describe('CreateCoinComponent', () => {
  let component: CreateCoinComponent;
  let fixture: ComponentFixture<CreateCoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCoinComponent]
    });
    fixture = TestBed.createComponent(CreateCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
