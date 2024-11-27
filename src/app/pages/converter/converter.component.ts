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
  amount: number;
  selectedFromCurrency: string = '';
  selectedToCurrency: string = '';
  currencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  result: string = '';
  userSubscriptionType: string = '';
  userConversionsLeft: number | string = 0;

  userId: number;
  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService);

  ngOnInit() {
    this.userId = parseInt(localStorage.getItem('userId') ?? '0');
    this.loadCurrencies();
    this.getUserSubscription();  // Obtener la suscripción al iniciar
    this.loadUserDetails();
  }

  async loadCurrencies(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.currencyService.getUserCurrencies();
      this.currencies = data;
      this.favoriteCurrencies = data.filter((currency) => currency.isDefault); // Ejemplo: isDefault indica si es favorita
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
            this.userConversionsLeft = sub.conversions; // Número de conversiones restantes
        }
    } catch (err) {
        console.error('Error al obtener la suscripción:', err);
        this.userSubscriptionType = 'Error al obtener la suscripción';
        this.userConversionsLeft = 'Error al obtener las conversiones';
    }
}


  async loadUserDetails(): Promise<void> {
    try {
      const sub = await this.subscriptionService.getUserSubscription(this.userId);
      this.userSubscriptionType = sub?.name || 'Plan no disponible';
      this.userConversionsLeft = sub?.conversions || 0;
    } catch (err) {
      console.error('Error al cargar los detalles del usuario:', err);
      this.userSubscriptionType = 'Error al obtener el plan';
      this.userConversionsLeft = 'Error al cargar intentos';
    }
  }

  onFromCurrencySelected(event: any): void {
    this.selectedFromCurrency = event.legend;
  }

  onToCurrencySelected(event: any): void {
    this.selectedToCurrency = event.legend;
  }

  async convertCurrency(): Promise<void> {
    const fromCurrencyId = this.currencies.find(currency => currency.legend === this.selectedFromCurrency)?.currencyId;
    const toCurrencyId = this.currencies.find(currency => currency.legend === this.selectedToCurrency)?.currencyId;

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
}
