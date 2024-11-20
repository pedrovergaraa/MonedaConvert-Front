import { Component, inject, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  router = inject(Router)
  currency: Currency | null = null;
  selectedCurrency: Currency;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadCurrencyDetails();
  }

  async loadCurrencyDetails() {
    try {
      const currencyId = 1;
      this.currency = await this.currencyService.getCurrencyById(currencyId);
    } catch (error) {
      console.error('Error al cargar los detalles de la moneda', error);
    }
  }

  async editCurrency() {
    try {
      if (this.currency) {
        await this.currencyService.editCurrency(this.currency.currencyId, this.currency);
        SuccessMessage('Moneda editada correctamente');
        this.router.navigate(['/converter']);
      }
    } catch (error) {
      console.error('Error al editar la moneda', error);
      ErrorMessage('Error al editar la moneda');
    }
  }

  cancelEdit() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Perderás los cambios no guardados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.currency) {
          this.selectedCurrency = { ...this.currency }; 
        }
        this.router.navigate(['/converter']); 
      }
    });
  }

  confirmDelete() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar la moneda ${this.currency?.legend}?`,
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
      if (this.currency) {
        const response = await this.currencyService.deleteCurrency(this.currency.currencyId);
        if (response) {
          SuccessMessage('Moneda eliminada correctamente');
          this.router.navigate(['/converter']);
        } else {
          ErrorMessage('Error eliminando la moneda');
        }
      }
    } catch (error) {
      ErrorMessage('Error al eliminar la moneda');
    }
  }
}
