import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {
  currencyService = inject(CurrencyService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  originalCurrency: Currency | null = null;
  
  selectedCurrency: Currency = {
    id: 0,
    legend: '',
    symbol: '',
    ic: 0
  };

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCurrency(id);
  }

  async loadCurrency(id: number) {
    try {
      const currency = await this.currencyService.getCurrencyById(id);
      if (currency) {
        this.originalCurrency = { ...currency };
        this.selectedCurrency = { ...currency };  
      }
    } catch (error) {
      ErrorMessage('Error al cargar la moneda');
    }
  }

  async editCoin() {
    try {
      const success = await this.currencyService.editCurrency(this.selectedCurrency);
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Editada correctamente',
          text: 'La moneda se ha editado con éxito',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.router.navigate(['/coins']); 
        });
      } else {
        ErrorMessage('Error editando Currency');
      }
    } catch (error) {
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
        if (this.originalCurrency) {
          this.selectedCurrency = { ...this.originalCurrency }; 
        }
        this.router.navigate(['/converter']); 
      }
    });
  }
}
