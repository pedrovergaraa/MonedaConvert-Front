import { Component, inject, OnInit } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { AuthService } from 'src/app/services/auth.service';  // Asegúrate de importar el AuthService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent implements OnInit {

  currencyService = inject(CurrencyService)
  authService = inject(AuthService)

  userCurrencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  defaultCurrencies: Currency[] = [];
  isCreateCoinModalOpen: boolean = false;

  ngOnInit(): void {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      
      const userId = this.authService.getUserId();

      this.userCurrencies = await this.currencyService.getUserCurrencies();

      this.favoriteCurrencies = await this.currencyService.getFavoriteCurrencies(userId);
      this.defaultCurrencies = await this.currencyService.getDefaultCurrencies();
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  }

  async loadFavoriteCurrencies() {
    try {
      const userId = 1; // Aquí reemplaza con el ID dinámico del usuario
      this.favoriteCurrencies = await this.currencyService.getFavoriteCurrencies(userId);
    } catch (error) {
      console.error('Error al cargar las monedas favoritas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al obtener las monedas favoritas.',
      });
    }
  }
  

  async removeFavoriteCurrency(favoriteCurrencyId: number) {
    try {
      const userId = 1; // Reemplaza con el ID dinámico
      await this.currencyService.removeFavoriteCurrency(favoriteCurrencyId);
  
      // Actualiza la lista de monedas favoritas después de eliminar
      this.favoriteCurrencies = this.favoriteCurrencies.filter(currency => currency.currencyId !== favoriteCurrencyId);
  
      Swal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'La moneda favorita ha sido eliminada.',
      });
    } catch (error) {
      console.error('Error al eliminar la moneda favorita:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al eliminar la moneda favorita.',
      });
    }
  }
  

  openCreateCoinModal() {
    this.isCreateCoinModalOpen = true;
  }

  closeCreateCoinModal() {
    this.isCreateCoinModalOpen = false;
  }
}
