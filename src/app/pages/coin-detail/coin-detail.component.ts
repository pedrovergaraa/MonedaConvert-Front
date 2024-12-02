import { Component, OnInit, inject } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../interfaces/Currency';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss'],
})
export class CoinDetailComponent implements OnInit {

  currency: Currency | null = null;
  
  route = inject(ActivatedRoute);
  router = inject(Router);
  currencyService = inject(CurrencyService);

  ngOnInit() {
    this.loadCurrencyDetails();
  }

  async loadCurrencyDetails() {
    const currencyId = this.route.snapshot.paramMap.get('currencyId');
    if (!currencyId) return;
    try {
      this.currency = await this.currencyService.getCurrencyById(Number(currencyId));
    } catch (error) {
      console.error('Error al cargar moneda:', error);
    }
  }

  async editCurrency() {
    if (!this.currency) return;
    try {
      await this.currencyService.editCurrency(this.currency.currencyId, this.currency);
      this.router.navigate(['/']);
      Swal.fire({
        title: '¡Éxito!',
        text: 'La moneda se ha editado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error al actualizar moneda:', error);
    }
  }

  cancelEdit() {
    this.router.navigate(['/']);
  }
}
