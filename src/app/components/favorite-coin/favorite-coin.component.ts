import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
})
export class FavoriteCoinComponent implements OnInit {
  
  
  @Input() selectedCurrency: string = '';
  @Input() currency!: Currency;
  @Output() currencySelected = new EventEmitter<Currency>();

  router = inject(Router)
  currencyService = inject(CurrencyService);
  favoriteCurrencies: Currency[] = [];
  availableNonFavoriteCurrencies: Currency[] = [];
  showDropdown = false;
  selectedCurrencyObj!: Currency;

selectCurrency(currency: Currency) {
  this.selectedCurrency = currency.legend;
  this.selectedCurrencyObj = currency; // Guardar la referencia completa
  this.currencySelected.emit(currency);
  this.toggleDropdown();
}

goToEditPage(currency: Currency) {
  if (currency && currency.currencyId) {
    this.router.navigate(['/coin-detail', currency.currencyId]);
  } else {
    console.error('La moneda seleccionada no tiene un ID válido.');
  }
}


  ngOnInit() {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      const userCurrencies = await this.currencyService.getUserCurrencies();
      this.sortCurrencies(userCurrencies);
    } catch (error) {
      console.error('Error al cargar monedas del usuario:', error);
    }
  }

  sortCurrencies(currencies: Currency[]) {
    this.favoriteCurrencies = currencies.filter((currency) => currency.isDefault);
    this.availableNonFavoriteCurrencies = currencies.filter((currency) => !currency.isDefault);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  // selectCurrency(currency: Currency) {
  //   this.selectedCurrency = currency.legend;
  //   this.currencySelected.emit(currency);
  //   this.toggleDropdown();
  // }

  // goToEditPage(currency: Currency) {
  //   this.router.navigate(['/coin-detail', currency.currencyId]);
  // }
  

  async toggleFavorite(currency: Currency, event: MouseEvent) {
    event.stopPropagation(); // Evitar que el evento afecte la selección de moneda
    try {
      if (currency.isDefault) {
        await this.removeFavorite(currency);
      } else {
        await this.addFavorite(currency);
      }
    } catch (error) {
      console.error('Error al cambiar el estado de favorito:', error);
    }
  }

  async addFavorite(currency: Currency) {
    const success = await this.currencyService.addFavoriteCurrency(currency.currencyId);
    if (success) {
      currency.isDefault = true;
      this.updateCurrencyLists(currency);
    }
  }

  async removeFavorite(currency: Currency) {
    const success = await this.currencyService.removeFavoriteCurrency(currency.currencyId);
    if (success) {
      currency.isDefault = false;
      this.updateCurrencyLists(currency);
    }
  }

  updateCurrencyLists(updatedCurrency: Currency) {
    if (updatedCurrency.isDefault) {
      this.favoriteCurrencies = [...this.favoriteCurrencies, updatedCurrency];
      this.availableNonFavoriteCurrencies = this.availableNonFavoriteCurrencies.filter(
        (currency) => currency.currencyId !== updatedCurrency.currencyId
      );
    } else {
      this.availableNonFavoriteCurrencies = [...this.availableNonFavoriteCurrencies, updatedCurrency];
      this.favoriteCurrencies = this.favoriteCurrencies.filter(
        (currency) => currency.currencyId !== updatedCurrency.currencyId
      );
    }
  }
}
