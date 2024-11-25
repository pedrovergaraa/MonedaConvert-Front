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
  userConversionsLeft: number = 0; // Para los intentos restantes
  userId: number; // O cualquier valor adecuado
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService);

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem('userId') ?? '0');
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
      console.error('Error al cargar las monedas:', err);
      this.error.set('No se pudieron cargar las monedas. Inténtalo más tarde.');
    } finally {
      this.loading.set(false);
    }
  }

  async getUserSubscription() {
    try {
      const sub = await this.subscriptionService.getUserSubscription(this.userId);

      if (sub && sub.name && sub.conversions >= 0) {
        this.userSubscriptionType = sub.name; // Tipo de suscripción
      }
    } catch (err) {
      console.error('Error al obtener la suscripción:', err);
    }
  }

  async loadRemainingAttempts(): Promise<void> {
    try {
      this.userConversionsLeft = await this.currencyService.getRemainingAttempts(this.userId);
    } catch (err) {
      console.error('Error al cargar los intentos restantes:', err);
    }
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
        const { convertedAmount, remainingAttempts } = await this.currencyService.convert(this.amount, fromCurrencyId, toCurrencyId);
        this.result = `Resultado: ${convertedAmount}`;
        this.userConversionsLeft = remainingAttempts; // Actualiza los intentos restantes

        // Opcional: Recargar los datos de suscripción
        this.getUserSubscription();
      } catch (error) {
        console.error('Error en la conversión:', error);
        this.result = 'Hubo un error en la conversión.';
      }
    } else {
      this.result = 'Por favor selecciona monedas válidas.';
    }
  }

  async deleteCurrency(currencyId: number) {
    try {
      await this.currencyService.deleteCurrency(currencyId);
      this.loadCurrencies(); // Recargar las monedas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la moneda:', error);
    }
  }
}
