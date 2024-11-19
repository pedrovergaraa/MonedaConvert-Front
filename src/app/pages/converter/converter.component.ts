import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { Currency } from '../../interfaces/Currency';
import { CurrencyService } from '../../services/currency.service'; // Nuevo servicio para manejar monedas


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
  favoriteCoins: Currency[] = []; // Para almacenar las monedas favoritas
  result: string = '';
  userSubscriptionType: string = ''; // Para mostrar el tipo de suscripción

  subscriptionService = inject(SubscriptionService);
  currencyService = inject(CurrencyService); // Nuevo servicio para interactuar con las monedas

  ngOnInit() {
    // Obtener las monedas del usuario cuando se inicia el componente
    this.currencyService.getCurrencies().then((currencies) => {
      this.currencies = currencies;
      this.selectedFromCoin = this.currencies[0]?.legend || '';
      this.selectedToCoin = this.currencies[0]?.legend || '';
    });
  }
  
  async loadUserData() {
    try {
      // Obtener monedas favoritas y monedas del usuario
      await this.currencyService.getUserCurrencies();
      this.currencyService.getCurrencies().then((currencies) => {
        this.currencies = currencies;
      });
      
      // this.currencyService.getFavoriteCurrencies(userId).then((favoriteCurrencies) => {
      //   this.favoriteCoins = favoriteCurrencies;
      // });

      // Establecer las monedas por defecto
      this.selectedFromCoin = this.currencies[0]?.legend || '';
      this.selectedToCoin = this.currencies[0]?.legend || '';
    } catch (error) {
      console.error('Error al obtener las monedas del usuario:', error);
    }
  }

  onFromCoinSelected(event: any): void {
    console.log('From coin selected:', event);
    this.selectedFromCoin = event.legend;
  }

  onToCoinSelected(event: any): void {
    console.log('To coin selected:', event);
    this.selectedToCoin = event.legend;
  }

  async convertCurrency() {
    const fromCurrencyId = this.currencies.find(currency => currency.legend === this.selectedFromCoin)?.id;
    const toCurrencyId = this.currencies.find(currency => currency.legend === this.selectedToCoin)?.id;

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
      this.loadUserData(); // Recargar las monedas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la moneda:', error);
    }
  }
}
