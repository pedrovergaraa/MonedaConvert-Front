import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  amount: number = 0;
  selectedFromCoin: string = '';
  selectedToCoin: string = '';
  currencies: Currency[] = [];
  favoriteCoins: Currency[] = [];
  result: string = '';
  userSubscriptionType: string = '';
  subscription: string = '';
  convertCount: number = 0;
  userId: number; // O cualquier valor adecuado, o bien pasarlo desde el contexto si corresponde

  
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService);
  remainingAttempts: number;

  ngOnInit() {
    this.loadCurrencies();
    this.getUserSubscription();
    this.loadRemainingAttempts();
  }
  
  async loadCurrencies(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.currencyService.getUserCurrencies();
      this.currencies = data;
  
      // Clasificar las monedas favoritas y no favoritas
      this.favoriteCoins = data.filter((coin) => coin.isDefault); // Ejemplo: isDefault indica si es favorita
    } catch (err) {
      console.error("Error al cargar las monedas:", err);
      this.error.set("No se pudieron cargar las monedas. Inténtalo más tarde.");
    } finally {
      this.loading.set(false);
    }
  }
  

  async loadRemainingAttempts() {
    try {
      // Asegúrate de que el `userId` es válido y está disponible
      this.remainingAttempts = await this.subscriptionService.getSub(this.userId);
    } catch (err) {
      console.warn("Error fetching remaining attempts", err);
    }
  }

  
  async getUserSubscription() {
    const sub = await this.subscriptionService.getSub(this.userId);
    console.log(sub); // Aquí tienes los intentos restantes
  }


  onFromCoinSelected(event: any): void {
    this.selectedFromCoin = event.legend;
  }

  onToCoinSelected(event: any): void {
    this.selectedToCoin = event.legend;
  }

  async convertCurrency() {
    const fromCurrencyId = this.currencies.find(currency => currency.legend === this.selectedFromCoin)?.currencyId;
    const toCurrencyId = this.currencies.find(currency => currency.legend === this.selectedToCoin)?.currencyId;

    if (fromCurrencyId && toCurrencyId) {
      try {
        const convertedAmount = await this.currencyService.convert(this.amount, fromCurrencyId, toCurrencyId);
        this.result = `Resultado: ${convertedAmount}`;
      } catch (error) {
        this.result = 'Hubo un error en la conversión.';
      }
    } else {
      this.result = 'Por favor selecciona monedas válidas.';
    }
  }

  // Método para eliminar una moneda
  async deleteCurrency(currencyId: number) {
    try {
      await this.currencyService.deleteCurrency(currencyId);
      this.loadCurrencies(); // Recargar las monedas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la moneda:', error);
    }
  }
}
