import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-card-coin',
  standalone: true,
  templateUrl: './card-coin.component.html',
  styleUrls: ['./card-coin.component.scss']
})
export class CardCoinComponent {
  @Input() currency!: Currency;

  coinsService = inject(CurrencyService);
  router = inject(Router);

  // Método para eliminar la moneda
  async deleteCoin() {
    try {
      const response = await this.coinsService.deleteCurrency(this.currency.id);
      if (response) {
        SuccessMessage('Eliminada correctamente');
        this.router.navigate(['/coins']); // Redirige después de la eliminación
      } else {
        ErrorMessage('Error eliminando Currency');
      }
    } catch (error) {
      ErrorMessage('Error en la eliminación de la moneda');
    }
  }
}