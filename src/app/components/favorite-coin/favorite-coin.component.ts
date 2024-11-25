import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
})
export class FavoriteCoinComponent implements OnInit {
  @Input() selectedCoin: string = ''; // Moneda seleccionada
  @Output() coinSelected = new EventEmitter<Currency>();
  currencyService = inject(CurrencyService);

  favoriteCoins: Currency[] = [];
  availableNonFavoriteCoins: Currency[] = [];
  showDropdown = false;

  constructor() {}

  ngOnInit() {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      const { favorites, nonFavorites } = await this.getSortedCurrencies();
      this.favoriteCoins = favorites;
      this.availableNonFavoriteCoins = nonFavorites;
    } catch (error) {
      console.error('Error al cargar monedas:', error);
    }
  }

  async getSortedCurrencies(): Promise<{ favorites: Currency[], nonFavorites: Currency[] }> {
    const currencies = await this.currencyService.getUserCurrencies();

    const favorites = currencies.filter((coin) => coin.isDefault);
    const nonFavorites = currencies.filter((coin) => !coin.isDefault);

    return { favorites, nonFavorites };
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCoin(coin: Currency) {
    this.selectedCoin = coin.legend;
    this.coinSelected.emit(coin);
    this.toggleDropdown();
  }

  async toggleFavorite(coin: Currency, event: MouseEvent) {
    event.stopPropagation();
    try {
      if (coin.isDefault) {
        const success = await this.currencyService.removeFavoriteCurrency(coin.currencyId);
        if (success) {
          coin.isDefault = false;
          this.favoriteCoins = this.favoriteCoins.filter((c) => c.currencyId !== coin.currencyId);
          this.availableNonFavoriteCoins.push(coin);
        } else {
          console.error('Error al eliminar de favoritos.');
        }
      } else {
        const success = await this.currencyService.addFavoriteCurrency(coin.currencyId);
        if (success) {
          coin.isDefault = true;
          this.availableNonFavoriteCoins = this.availableNonFavoriteCoins.filter((c) => c.currencyId !== coin.currencyId);
          this.favoriteCoins.push(coin);
        } else {
          console.error('Error al agregar a favoritos.');
        }
      }
    } catch (error) {
      console.error('Error en toggleFavorite:', error);
    }
  }
}
