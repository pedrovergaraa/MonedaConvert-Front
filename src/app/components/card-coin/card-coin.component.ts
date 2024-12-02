import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
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
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  @Input() currency!: Currency;

  currencyService = inject(CurrencyService);
  router = inject(Router);

  confirmDelete() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la moneda ${this.currency.legend}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.deleteCoin();
      }
    });
  }

  async deleteCoin() {
    try {
      const response = await this.currencyService.deleteCurrency(this.currency.currencyId);
      if (response) {
        SuccessMessage('Eliminada correctamente');
        this.router.navigate(['/converter']);
      } else {
        ErrorMessage('Error eliminando Currency');
      }
    } catch (error) {
      ErrorMessage('Error en la eliminación de la moneda');
    }
  }
}
