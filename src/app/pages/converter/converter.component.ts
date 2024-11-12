
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {

  constructor() { }


  selectedFromCoin: string = '';
  selectedToCoin: string = '';
  message: string = '';
  subscriptionType: string = 'Standard';
  amount: number = 0;
  result: number = 0;
  remainingAttempts: number = 99999;

  onFromCoinSelected(coin: string) {
    this.selectedFromCoin = coin;
  }

  onToCoinSelected(coin: string) {
    this.selectedToCoin = coin;
  }
}
