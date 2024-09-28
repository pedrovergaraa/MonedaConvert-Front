import { Component } from '@angular/core';

@Component({
  selector: 'app-favorite-coins',
  templateUrl: './favorite-coins.component.html', // Asegúrate que el nombre del archivo sea correcto
  styleUrls: ['./favorite-coins.component.css'] // Asegúrate que el nombre del archivo sea correcto
})
export class FavoriteCoinsComponent {
  favoriteCoins: string[] = ['USD', 'EUR', 'JPY']; // Ejemplo de monedas favoritas

  toggleDropdown: boolean = false;

  toggleFavoriteCoins() {
    this.toggleDropdown = !this.toggleDropdown;
  }
}
