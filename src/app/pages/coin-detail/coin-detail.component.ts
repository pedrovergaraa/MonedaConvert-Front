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
    // Obtener el ID de la moneda desde la URL
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCurrency(id);
  }

  // Método para cargar los datos de la moneda a editar
  async loadCurrency(id: number) {
    try {
      const currency = await this.currencyService.getCurrencyById(id);
      if (currency) {
        this.originalCurrency = { ...currency }; // Guardar una copia de la moneda original
        this.selectedCurrency = { ...currency };  // Cargar la moneda en selectedCurrency para edición
      }
    } catch (error) {
      ErrorMessage('Error al cargar la moneda');
    }
  }

  // Método para guardar los cambios de edición
  async editCoin() {
    try {
      const success = await this.currencyService.editCurrency(this.selectedCurrency);
      if (success) {
        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Editada correctamente',
          text: 'La moneda se ha editado con éxito',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          this.router.navigate(['/coins']); // Redirigir a la lista de monedas después de editar
        });
      } else {
        ErrorMessage('Error editando Currency');
      }
    } catch (error) {
      ErrorMessage('Error al editar la moneda');
    }
  }

  // Método para cancelar la edición y restaurar los valores originales
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
          this.selectedCurrency = { ...this.originalCurrency }; // Restaurar a los valores originales
        }
        this.router.navigate(['/converter']); // Redirigir a la lista de monedas
      }
    });
  }
}
