import { Component, inject, Inject, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  // Cargar los detalles de la moneda
  async loadCurrencyDetails() {
    try {
      const currencyId = 1; // Deberás obtener el ID dinámicamente
      this.currency = await this.currencyService.getCurrencyById(currencyId);
    } catch (error) {
      console.error('Error al cargar los detalles de la moneda', error);
    }
  }

  // Método para editar la moneda
  async editCurrency() {
    try {
      if (this.currency) {
        await this.currencyService.editCurrency(this.currency.currencyId, this.currency);

      }
    } catch (error) {
      console.error('Error al editar la moneda', error);
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
  // Método para eliminar la moneda
  async deleteCurrency() {
    try {
      if (this.currency) {
        await this.currencyService.deleteCurrency(this.currency.currencyId);
      }
    } catch (error) {
      console.error('Error al eliminar la moneda', error);
    }
  }
}
