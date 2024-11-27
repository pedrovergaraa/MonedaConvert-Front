import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
})
export class FavoriteCoinComponent implements OnInit {
  @Input() selectedCurrency: string = ''; 
  @Output() currencySelected = new EventEmitter<Currency>();

  currencyService = inject(CurrencyService);
  favoriteCurrencies: Currency[] = [];
  availableNonFavoriteCurrencies: Currency[] = [];
  showDropdown = false;

  constructor() {}

  ngOnInit() {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      const currencies = await this.currencyService.getUserCurrencies();
      this.sortCurrencies(currencies);
    } catch (error) {
      console.error('Error al cargar monedas:', error);
    }
  }

  sortCurrencies(currencies: Currency[]) {
    this.favoriteCurrencies = currencies.filter((currency) => currency.isDefault);
    this.availableNonFavoriteCurrencies = currencies.filter((currency) => !currency.isDefault);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCurrency(currency: Currency) {
    this.selectedCurrency = currency.legend;
    this.currencySelected.emit(currency);
    this.toggleDropdown();
  }

  async toggleFavorite(currency: Currency, event: MouseEvent) {
    event.stopPropagation(); // Prevenir selección de la moneda
    try {
      if (currency.isDefault) {
        const success = await this.currencyService.removeFavoriteCurrency(currency.currencyId);
        if (success) {
          currency.isDefault = false;
          this.updateCurrencyLists(currency);
        }
      } else {
        const success = await this.currencyService.addFavoriteCurrency(currency.currencyId);
        if (success) {
          currency.isDefault = true;
          this.updateCurrencyLists(currency);
        }
      }
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
    }
  }

  updateCurrencyLists(updatedCurrency: Currency) {
    if (updatedCurrency.isDefault) {
      // Agregar a favoritos y eliminar de no favoritos
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
