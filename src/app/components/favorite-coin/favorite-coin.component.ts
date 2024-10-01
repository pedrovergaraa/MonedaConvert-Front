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
    availableCoins: string[] = ['USD', 'EUR', 'GBP', 'JYN', 'ARS']; // Lista completa de monedas
    favoriteCoins: Set<string> = new Set(); // Gestión de monedas favoritas

    toggleDropdown() {
        this.showDropdown = !this.showDropdown;
    }

    selectCoin(coin: string) {
        this.coinSelected.emit(coin);
        this.showDropdown = false; // Cerrar el dropdown al seleccionar
    }

    toggleFavorite(coin: string, event: MouseEvent) {
        event.stopPropagation(); // Evitar que el dropdown se cierre al marcar/desmarcar favoritos

        if (this.favoriteCoins.has(coin)) {
            this.favoriteCoins.delete(coin); // Eliminar de favoritos
        } else {
            this.favoriteCoins.add(coin); // Agregar a favoritos
        }
    }

    get availableNonFavoriteCoins() {
        // Monedas disponibles que no son favoritas
        return this.availableCoins.filter(coin => !this.favoriteCoins.has(coin));
    }

    editCoin() {
        // Implementar funcionalidad de edición si es necesario
    }
}
