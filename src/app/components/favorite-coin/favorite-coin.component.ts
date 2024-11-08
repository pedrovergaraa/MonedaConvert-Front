import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrencyService } from 'src/app/services/currency.service';
import { Currency } from 'src/app/interfaces/Currency';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';

@Component({
  selector: 'app-favorite-coin',
  standalone: true,
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
  imports: [CommonModule],
})

export class FavoriteCoinComponent {
  @Input() selectedCurrency: any;
  @Output() currencySelected = new EventEmitter<string>();

  router = inject(Router);
  currencyService = inject(CurrencyService);

  showDropdown: boolean = false;
  availableCurrencies: string[] = ['USD', 'EUR', 'GBP', 'JYN', 'ARS']; 
  favoriteCurrencies: Currency[] = [];

  // Inicializa el componente con las monedas favoritas
  ngOnInit(): void {
    this.loadFavoriteCurrencies();
  }

  // Cargar monedas favoritas desde el servicio
  async loadFavoriteCurrencies() {
    try {
      const currencies = await this.currencyService.getFavoriteCurrencies();
      this.favoriteCurrencies = currencies;
    } catch (error) {
      ErrorMessage('Error al cargar monedas favoritas');
    }
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCurrency(currency: string) {
    this.currencySelected.emit(currency);
    this.showDropdown = false; 
  }

  async toggleFavorite(currency: Currency, event: MouseEvent) {
    event.stopPropagation(); 

    try {
      if (this.isFavorite(currency)) {
        // Eliminar moneda de favoritos
        await this.currencyService.removeFavorite(currency.id);
        this.favoriteCurrencies = this.favoriteCurrencies.filter(c => c.id !== currency.id); 
        SuccessMessage('Moneda eliminada de favoritos');
      } else {
        await this.currencyService.addFavorite(currency);
        this.favoriteCurrencies.push(currency); 
        SuccessMessage('Moneda agregada a favoritos');
      }
    } catch (error) {
      ErrorMessage('Error al actualizar moneda favorita');
    }
  }


  isFavorite(currency: Currency): boolean {
    return this.favoriteCurrencies.some(fav => fav.id === currency.id);
  }


  get availableNonfavoritecurrencies() {
    return this.availableCurrencies.filter(currency => !this.isFavorite({id: 0, legend: currency, symbol: currency, ic: 0})); 
  }

 
  editCurrency(currency: Currency) {
    this.router.navigate(['/coin-detail', currency.id]);
  }
}
