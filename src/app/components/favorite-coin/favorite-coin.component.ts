import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
    selector: 'app-favorite-coin',
    templateUrl: './favorite-coin.component.html',
    styleUrls: ['./favorite-coin.component.scss']
})
export class FavoriteCoinComponent {
  @Input() selectedCoin: string;
  @Output() coinSelected = new EventEmitter<string>();

  currencyService = inject(CurrencyService)

  currencyFav : Currency = {
      currencyId: 0,
      legend: '',
      symbol: '',
      ic: 0,
      isDefault: false,
      userId: 0
  }
    
    showDropdown: boolean = false;
    availableCoins: string[] = ['USD', 'EUR', 'GBP', 'JYN', 'ARS']; 
    favoriteCoins: Set<string> = new Set(); 

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    selectCoin(coin: string) {
      this.coinSelected.emit(coin); 
      this.showDropdown = false; 
  }
  

    toggleFavorite(coin: string, event: MouseEvent) {
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