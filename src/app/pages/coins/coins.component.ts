import { Component, inject, OnInit } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent implements OnInit {

  currencyService = inject(CurrencyService);
  authService = inject(AuthService);
  
  userCurrencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  defaultCurrencies: Currency[] = [];
  isCreateCurrencyModalOpen: boolean = false;

  ngOnInit(): void {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      console.log('Cargando monedas...');
      const [userCurrencies, favoriteCurrencies, defaultCurrencies] = await Promise.all([
        this.currencyService.getUserCurrencies(),
        this.currencyService.getFavoriteCurrencies(),
        this.currencyService.getDefaultCurrencies(),
      ]);
      this.userCurrencies = userCurrencies;
      this.favoriteCurrencies = favoriteCurrencies;
      this.defaultCurrencies = defaultCurrencies;
      console.log('Monedas cargadas:', {
        userCurrencies: this.userCurrencies,
        favoriteCurrencies: this.favoriteCurrencies,
        defaultCurrencies: this.defaultCurrencies
      });
    } catch (error) {
      console.error('Error al cargar las monedas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar las monedas.',
      });
    }
  }

  async removeFavoriteCurrency(favoriteCurrencyId: number) {
    try {
      const success = await this.currencyService.removeFavoriteCurrency(favoriteCurrencyId);
      if (success) {
        this.favoriteCurrencies = this.favoriteCurrencies.filter(
          currency => currency.currencyId !== favoriteCurrencyId
        );
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La moneda favorita ha sido eliminada.',
        });
      } else {
        throw new Error('No se pudo eliminar la moneda favorita.');
      }
    } catch (error) {
      console.error('Error al eliminar la moneda favorita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar la moneda favorita.',
      });
    }
  }

  async addFavoriteCurrency(currencyId: number) {
    try {
      const success = await this.currencyService.addFavoriteCurrency(currencyId);
      if (success) {
        const addedCurrency = this.defaultCurrencies.find(currency => currency.currencyId === currencyId);
        if (addedCurrency) {
          this.favoriteCurrencies.push(addedCurrency);
        }
        Swal.fire({
          icon: 'success',
          title: 'Agregado',
          text: 'La moneda se ha agregado a favoritos.',
        });
      } else {
        throw new Error('No se pudo agregar la moneda a favoritos.');
      }
    } catch (error) {
      console.error('Error al agregar la moneda favorita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al agregar la moneda a favoritos.',
      });
    }
  }

  openCreateCurrencyModal() {
    this.isCreateCurrencyModalOpen = true;
  }

  closeCreateCurrencyModal() {
    this.isCreateCurrencyModalOpen = false;
  }
}
