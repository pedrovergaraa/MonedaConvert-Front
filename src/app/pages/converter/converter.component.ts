import { Component } from '@angular/core';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {
  selectedFromCoin: string = '';
  selectedToCoin: string = '';

    onFromCoinSelected(coin: string) {
      this.selectedFromCoin = coin;
  }

  onToCoinSelected(coin: string) {
      this.selectedToCoin = coin;
  }
}
