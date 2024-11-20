import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { ErrorMessage, SuccessMessage } from 'src/app/helpers/messageModal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creat-coin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creat-coin.component.html',
  styleUrls: ['./creat-coin.component.scss']
})
export class CreatCoinComponent {
  currencyService = inject(CurrencyService);
  router = inject(Router);

  @Output() close = new EventEmitter<void>();
  @Input() currency: Currency = {
    currencyId: 0,
    legend: '',
    symbol: '',
    ic: 0,
    isDefault: false,
    userId: 0
  };

  onSubmit() {
    // Verificar si los campos no están vacíos
    if (!this.currency.legend || !this.currency.symbol || this.currency.ic <= 0) {
      // Si los campos están incompletos, muestra un mensaje de error
      ErrorMessage('Por favor complete todos los campos correctamente.');
      return;
    }

    // Crear la moneda
    this.currencyService.createCurrency(this.currency).then(res => {
      this.close.emit(); // Cierra el formulario
      if (res) {
        // Si la respuesta es exitosa, muestra el mensaje de éxito
        SuccessMessage('Moneda creada correctamente.');
      } else {
        // Si la creación falla, muestra el mensaje de error
        ErrorMessage('Error creando moneda.');
      }
    }).catch(error => {
      // Si ocurre un error en la llamada al servidor, muestra el mensaje de error
      console.error(error);
      ErrorMessage('Hubo un error al intentar crear la moneda.');
    });
  }
}
