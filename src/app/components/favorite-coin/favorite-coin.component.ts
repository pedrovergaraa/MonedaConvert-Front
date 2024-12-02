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

  currencyService = inject(CurrencyService);
  router = inject(Router);

  ngOnInit() {
    this.loadFavoriteCurrencies();
  }

  async loadFavoriteCurrencies() {
    try {
      this.favoriteCurrencies = await this.currencyService.getUserCurrencies();
    } catch (error) {
      console.error('Error al cargar las monedas:', error);
    }
  }

  toggleFavorite(currency: any): void {
    currency.isFavorite = !currency.isFavorite;  // Cambia el estado de favorito
  }
  
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectCurrency(currency: Currency) {
    this.selectedCurrency = currency;
    this.selectedCurrencyChange.emit(currency); // Notifica al padre la selección
  }

  goToEditPage(currency: Currency, event: MouseEvent) {
    event.stopPropagation(); // Evitar cerrar el dropdown
    this.router.navigate(['/coin-detail', currency.currencyId]);
  }
}
