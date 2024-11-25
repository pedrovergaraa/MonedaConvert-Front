import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss']
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
    const currencies = await this.currencyService.getUserCurrencies(); // Usa el servicio

    const favorites = currencies.filter((coin) => coin.isDefault);
    const nonFavorites = currencies.filter((coin) => !coin.isDefault);

    return { favorites, nonFavorites };
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCoin(coin: Currency) {
    this.selectedCoin = coin.legend; // Actualiza el texto en el input
    this.coinSelected.emit(coin); // Emite el evento para notificar al componente padre
    this.toggleDropdown();
  }

  async toggleFavorite(coin: Currency, event: MouseEvent) {
    event.stopPropagation(); // Evita que el evento afecte la selección de la moneda

    try {
      if (coin.isDefault) {
        await this.currencyService.removeFavoriteCurrency(coin.currencyId);
        coin.isDefault = false; // Actualiza el estado local
      } else {
        await this.currencyService.addFavoriteCurrency(coin.currencyId);
        coin.isDefault = true;
      }

      this.loadCurrencies(); // Recarga las listas ordenadas
    } catch (error) {
      console.error('Error al cambiar el estado de favorito:', error);
    }
  }
}
