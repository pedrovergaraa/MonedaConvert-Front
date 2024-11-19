import { Component, inject, OnInit } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { AuthService } from 'src/app/services/auth.service';  // Asegúrate de importar el AuthService

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
      // Obtener el userId desde el servicio de autenticación
      const userId = this.authService.getUserId();

      // Llamar a los servicios pasando el userId como argumento
      this.userCurrencies = await this.currencyService.getUserCurrencies();
      this.favoriteCurrencies = await this.currencyService.getFavoriteCurrencies(userId);
      this.defaultCurrencies = await this.currencyService.getDefaultCurrencies();
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  }

  openCreateCoinModal() {
    this.isCreateCoinModalOpen = true;
  }

  closeCreateCoinModal() {
    this.isCreateCoinModalOpen = false;
  }
}
