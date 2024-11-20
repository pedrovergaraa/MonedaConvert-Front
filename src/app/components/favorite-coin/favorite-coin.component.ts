import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Currency, FavoriteCurrency } from 'src/app/interfaces/Currency'; 
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
    selector: 'app-favorite-coin',
    templateUrl: './favorite-coin.component.html',
    styleUrls: ['./favorite-coin.component.scss']
})
export class FavoriteCoinComponent {
  @Input() selectedCoin: string;
  @Output() coinSelected = new EventEmitter<string>();

  currencyService = inject(CurrencyService);

  currencyFav: Currency = {
      currencyId: 0,
      legend: '',
      symbol: '',
      ic: 0,
      isDefault: false,
      userId: 0
  }

  showDropdown: boolean = false;
  availableCoins: Currency[] = [
    { currencyId: 1, legend: 'USD', symbol: '$', ic: 0, isDefault: false, userId: 0 },
    { currencyId: 2, legend: 'EUR', symbol: '€', ic: 1, isDefault: false, userId: 0 },
    { currencyId: 3, legend: 'GBP', symbol: '£', ic: 2, isDefault: false, userId: 0 },
    { currencyId: 4, legend: 'JYN', symbol: '¥', ic: 3, isDefault: false, userId: 0 },
    { currencyId: 5, legend: 'ARS', symbol: '$', ic: 4, isDefault: false, userId: 0 }
  ];

  favoriteCoins: Set<Currency> = new Set();

  toggleDropdown() {
      this.showDropdown = !this.showDropdown;
  }

  selectCoin(coin: Currency) {
    this.coinSelected.emit(coin.symbol);
    this.showDropdown = false;
  }

  toggleFavorite(coin: Currency, event: MouseEvent) {
      event.stopPropagation();

      if (this.favoriteCoins.has(coin)) {
          this.favoriteCoins.delete(coin);
      } else {
          this.favoriteCoins.add(coin);
      }
  }

  get availableNonFavoriteCoins() {
      return this.availableCoins.filter(coin => !this.favoriteCoins.has(coin));
  }

  editCoin() {
  }
}
