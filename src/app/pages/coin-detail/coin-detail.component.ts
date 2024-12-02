import { Component, inject, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  currency: Currency | null = null;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadCurrencyDetails();
  }

  cancelEdit() {
    console.log('Edición cancelada');
    this.resetCurrency();
    this.router.navigate(['/converter']);
  }

  private resetCurrency() {
    this.currency = {
      currencyId: 0,
      legend: '',
      symbol: '',
      ic: 0,
      isDefault: false,
      userId: 0
    };
  }

  async loadCurrencyDetails() {
    const currencyId = this.route.snapshot.paramMap.get('currencyId');
    console.log('ID de moneda recibido:', currencyId);
  
    if (!currencyId || isNaN(Number(currencyId))) {
      ErrorMessage('ID de moneda inválido');
      this.router.navigate(['/coins']);
      return;
    }
  
    try {
      this.currency = await this.currencyService.getCurrencyById(Number(currencyId));
      console.log('Moneda cargada:', this.currency);
      if (!this.currency) {
        this.resetCurrency();
        ErrorMessage('Moneda no encontrada');
      }
    } catch (error) {
      ErrorMessage('Error al cargar los detalles de la moneda');
      console.error(error);
    }
  }
  
  
  
  

  async editCurrency() {
    if (this.currency) {
      try {
        const updated = await this.currencyService.editCurrency(
          this.currency.currencyId,
          this.currency
        );
        if (updated) {
          SuccessMessage('Moneda editada correctamente');
          this.router.navigate(['/converter']);
        }
      } catch (error) {
        ErrorMessage('Error al editar la moneda');
        console.error(error);
      }
    }
  }
}
