import { Component, inject, OnInit, WritableSignal, signal } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import { Subscription } from 'src/app/interfaces/Subscription';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {
  amount: number;
  selectedFromCurrency: string = '';
  selectedToCurrency: string = '';
  currencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  result: string = '';
  userSubscriptionType: string | null = null;
  userConversionsLeft: number | null = null;
  userId: number = 0; // Asegúrate de que este ID se obtenga correctamente (puede ser del localStorage o servicio de auth)

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService);
  authService = inject(AuthService)

  ngOnInit() {
    this.loadCurrencies();
    this.userId = this.authService.getUserId(); // Asegúrate de que esto no sea 0
    this.loadUserSubscription(); // Cargar suscripción y intentos al inicio
  }
  
  // Cargar monedas
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

  // Obtener la suscripción y los intentos restantes
  async loadUserSubscription(): Promise<void> {
    if (this.userId === 0) {
      console.error('El userId es inválido');
      this.error.set('Usuario no autenticado.');
      return;
    }
  
    try {
      const response = await this.currencyService.getRemainingAttempts(this.userId);
      this.userConversionsLeft = response; // Actualizar intentos restantes (ahora asumimos que `response` es solo un número)
      const subscription = await this.subscriptionService.getUserSubscription(this.userId);
      this.userSubscriptionType = subscription.name; // Asignar nombre de la suscripción
    } catch (err) {
      console.error('Error al obtener la suscripción o intentos restantes:', err);
      this.error.set('Error al cargar los detalles del usuario.');
    }
  }

  // Selección de moneda de origen
  onFromCurrencySelected(event: any): void {
    this.selectedFromCurrency = event.legend;
  }

  // Selección de moneda de destino
  onToCurrencySelected(event: any): void {
    this.selectedToCurrency = event.legend;
  }

  // Convertir moneda
  async convertCurrency(): Promise<void> {
    const fromCurrencyId = this.currencies.find((currency) => currency.legend === this.selectedFromCurrency)?.currencyId;
    const toCurrencyId = this.currencies.find((currency) => currency.legend === this.selectedToCurrency)?.currencyId;

    if (fromCurrencyId && toCurrencyId) {
      try {
        const { convertedAmount, remainingAttempts } = await this.currencyService.convert(this.amount, fromCurrencyId, toCurrencyId);
        this.result = `Resultado: ${convertedAmount}`;
        this.userConversionsLeft = remainingAttempts; // Actualizar intentos restantes después de la conversión

        // Recargar los detalles de la suscripción después de la conversión
        await this.loadUserSubscription(); 
      } catch (error) {
        console.error('Error en la conversión:', error);
        this.result = 'Hubo un error en la conversión.';
      }
    } else {
      this.result = 'Por favor selecciona monedas válidas.';
    }
  }
}
