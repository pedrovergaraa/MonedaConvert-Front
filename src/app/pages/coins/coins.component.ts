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
      const [userCurrencies, favoriteCurrencies, defaultCurrencies] = await Promise.all([
        this.currencyService.getUserCurrencies(),
        this.currencyService.getFavoriteCurrencies(),
        this.currencyService.getDefaultCurrencies(),
      ]);
      this.userCurrencies = userCurrencies;
      this.favoriteCurrencies = favoriteCurrencies;
      this.defaultCurrencies = defaultCurrencies;
    } catch (error) {
      console.error('Error al cargar las monedas:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al cargar las monedas.',
      });
    }
  }

  onCurrencyCreated(newCurrency: Currency) {
    this.userCurrencies.push(newCurrency); 
  }

  openCreateCurrencyModal() {
    this.isCreateCurrencyModalOpen = true;
  }

  closeCreateCurrencyModal() {
    this.isCreateCurrencyModalOpen = false;
  }
}
