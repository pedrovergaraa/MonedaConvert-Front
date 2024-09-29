import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-favorite-coin',
    templateUrl: './favorite-coin.component.html',
    styleUrls: ['./favorite-coin.component.scss']
})
export class FavoriteCoinComponent {
    @Input() selectedCoin: string = '';
    @Output() coinSelected = new EventEmitter<string>();
    
    showDropdown: boolean = false;
    availableCoins: string[] = ['USD', 'EUR', 'GBP']; // Ejemplo de monedas
    favoriteCoins: Set<string> = new Set(); // Para gestionar monedas favoritas

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    selectCoin(coin: string) {
        this.coinSelected.emit(coin);
        this.showDropdown = false; // Cerrar dropdown al seleccionar
    }

    toggleFavorite(coin: string) {
        if (this.favoriteCoins.has(coin)) {
            this.favoriteCoins.delete(coin); // Desmarcar favorito
        } else {
            this.favoriteCoins.add(coin); // Marcar como favorito
        }
    }

    editCoin() {
        // Implementar funcionalidad para editar monedas si es necesario
    }
}
