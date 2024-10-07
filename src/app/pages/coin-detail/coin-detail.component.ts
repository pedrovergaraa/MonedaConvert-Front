import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

  coinsService = inject(CurrencyService)
  activatedRoute = inject(ActivatedRoute)
  router = inject(Router)

  currency: Currency = {
    id: 0,
    legend: '',
    symbol: '',
    ic: 0
  }

  editCurrency: Currency = {
    id: 0,
    legend: '',
    symbol: '',
    ic: 0
  }

  currencyFav: Currency = {
    id: 0,
    legend: '',
    symbol: '',
    ic: 0
  }

  botonDeshabilitado = false;

  ngOnInit(): void {
   
  }

  async editCoin() {
    const res = await this.coinsService.editCurrency(this.editCurrency);
    if (res) {
      SuccessMessage('Editada correctamente');
      this.router.navigate(['/coins']);
    } else {
      ErrorMessage('Error editando Currency');
    }
  }

  async deleteCoin() {
    this.activatedRoute.params.subscribe(async params => {
      const id = parseFloat(params['id']);
      const response = await this.coinsService.deleteCurrency(id);
      if (response) {
        SuccessMessage('Eliminada correctamente');
        this.router.navigate(['/coins']);
      } else {
        ErrorMessage('Error eliminando Currency');
      }
    });
  }

  async createFav() {
    const res = await this.coinsService.addFavorite(this.currency);
    if (res) {
      SuccessMessage('Agregada como favorita');
    } else {
      ErrorMessage('Error agregando Currency');
    }
    this.botonDeshabilitado = true;
  }

  async getFavByLegend(legend: string) {
    const res = await this.coinsService.getFavoriteCurrencies();
    if (res) {
      // Aquí deberías filtrar por leyenda si es necesario
      this.currencyFav = res.find(fav => fav.legend === legend) || this.currencyFav;
    }
  }
}
