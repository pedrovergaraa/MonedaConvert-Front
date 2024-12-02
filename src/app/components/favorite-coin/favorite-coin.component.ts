import { Component, OnInit, inject, Output, EventEmitter, Input } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-coin',
  templateUrl: './favorite-coin.component.html',
  styleUrls: ['./favorite-coin.component.scss'],
})
export class FavoriteCoinComponent implements OnInit {
  @Input() favoriteCurrencies: any[] = []; 
  @Input() selectedCurrency: Currency | null = null;
  @Output() selectedCurrencyChange = new EventEmitter<Currency>();
  showDropdown = false;
  currency : Currency;

  currencyService = inject(CurrencyService);
  router = inject(Router);

  ngOnInit() {
    this.loadFavoriteCurrencies();
  }

  async loadFavoriteCurrencies() {
    try {
      this.favoriteCurrencies = await this.currencyService.getUserCurrencies();
      this.sortCurrencies(); 
    } catch (error) {
      console.error('Error al cargar las monedas:', error);
    }
  }
  
  toggleFavorite(currency: any, event: MouseEvent): void {
    event.stopPropagation(); 
  
    if (currency.isFavorite) {
      this.currencyService.removeFavoriteCurrency(currency.currencyId)
        .then((success) => {
          if (success) {
            currency.isFavorite = false;
            console.log(`Moneda ${currency.legend} removida de favoritas`);
          } else {
            console.error('Error al remover moneda favorita');
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud para remover favorita:', error);
        });
    } else {
      this.currencyService.addFavoriteCurrency(currency.currencyId)
        .then((success) => {
          if (success) {
            currency.isFavorite = true;
            console.log(`Moneda ${currency.legend} marcada como favorita`);
          } else {
            console.error('Error al agregar moneda favorita');
          }
        })
        .catch((error) => {
          console.error('Error en la solicitud para agregar favorita:', error);
        });
    }
  }
  
  
  sortCurrencies(): void {
    this.favoriteCurrencies.sort((a, b) => {
      // Las favoritas primero; si ambas tienen el mismo estado, se mantiene el orden original
      return Number(b.isFavorite) - Number(a.isFavorite);
    });
  }
  
  
  goToEditPage(currency: Currency, event: MouseEvent): void {
    event.stopPropagation(); // Evitar cerrar el dropdown
    this.router.navigate(['/coin-detail', currency.currencyId]);
  }
  
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCurrency(currency: Currency): void {
    this.selectedCurrency = currency;
    this.selectedCurrencyChange.emit(currency); // Notifica al padre la selección
    this.showDropdown = false; // Cierra el dropdown
  }
 
}
