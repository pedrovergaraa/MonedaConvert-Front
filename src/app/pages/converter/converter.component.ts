import { Component } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service'; // Ajusta la importación a tu caso

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent {

  constructor(public subscriptionService: SubscriptionService) { }

  selectedFromCoin: string = '';
  selectedToCoin: string = '';
  message: string = '';
  subscriptionType: string = 'Standard';
  amount: number;
  result: number;

  onFromCoinSelected(coin: string): void {
    this.selectedFromCoin = coin;
    console.log(`Moneda de origen seleccionada: ${this.selectedFromCoin}`);
  }

  onToCoinSelected(coin: string): void {
    this.selectedToCoin = coin;
    console.log(`Moneda de destino seleccionada: ${this.selectedToCoin}`);
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<string | number> {
    const remainingAttempts = this.subscriptionService.getRemainingAttempts();

    if (remainingAttempts <= 0) {
      return `You have reached your conversion limit for the ${this.subscriptionService.getSubscriptionType()} plan.`;
    }

    try {
      const convertedAmount = await this.subscriptionService.convert(amount, fromCurrency, toCurrency);
      return convertedAmount;
    } catch (error) {
      console.error('Error in conversion:', error);
      return 'There was an error during the conversion process.';
    }
  }
}
