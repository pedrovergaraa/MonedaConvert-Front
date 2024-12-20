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
  selectedFromCurrency: Currency | null = null;
  selectedToCurrency: Currency | null = null;
  currencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  result: string = '';
  userSubscriptionType: string | null = null;
  userConversionsLeft: number | null = null;
  userId: number = 0; 

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService);
  authService = inject(AuthService);

  ngOnInit() {
    this.loadCurrencies();
    this.userId = this.authService.getUserId(); 
    this.loadUserSubscription(); 
  }
  
  async loadCurrencies(): Promise<void> {
    try {
      this.loading.set(true);
      const data = await this.currencyService.getUserCurrencies();
      this.currencies = data;
      this.favoriteCurrencies = data.filter((currency) => currency.isDefault); 
    } catch (err) {
      console.error('Error al cargar las monedas:', err);
      this.error.set('No se pudieron cargar las monedas. Inténtalo más tarde.');
    } finally {
      this.loading.set(false);
    }
  }
  
  async loadUserSubscription(): Promise<void> {
    if (this.userId === 0) {
      console.error('El userId es inválido');
      this.error.set('Usuario no autenticado.');
      return;
    }
  
    try {
      const response = await this.currencyService.getRemainingAttempts(this.userId);
      this.userConversionsLeft = response; 
      const subscription = await this.subscriptionService.getUserSubscription(this.userId);
      this.userSubscriptionType = subscription.name; 
    } catch (err) {
      console.error('Error al obtener la suscripción o intentos restantes:', err);
      this.error.set('Error al cargar los detalles del usuario.');
    }
  }

  onFromCurrencyChange(currency: Currency) {
    this.selectedFromCurrency = currency;
  }

  onToCurrencyChange(currency: Currency) {
    this.selectedToCurrency = currency;
  }

  async convertCurrency(): Promise<void> {
    const amountToConvert = Number(this.amount);
    if (isNaN(amountToConvert) || amountToConvert <= 0) {
      this.result = 'Ingrese un número válido mayor que 0.';
      return;
    }
    if (!this.selectedFromCurrency || !this.selectedToCurrency) {
      this.result = 'Por favor selecciona monedas válidas para convertir.';
      return;
    }
    const fromCurrencyId = this.selectedFromCurrency.currencyId;
    const toCurrencyId = this.selectedToCurrency.currencyId;

    if (!fromCurrencyId || !toCurrencyId) {
      this.result = 'Por favor selecciona monedas válidas.';
      return;
    }
    try {
      const { convertedAmount, remainingAttempts } = await this.currencyService.convert(amountToConvert, fromCurrencyId, toCurrencyId);
      this.result = `Resultado: ${convertedAmount}`;
      this.userConversionsLeft = remainingAttempts; 
      await this.loadUserSubscription();
    } catch (error) {
      console.error('Error en la conversión:', error);
      this.result = 'Hubo un error en la conversión.';
    }
  }
}
