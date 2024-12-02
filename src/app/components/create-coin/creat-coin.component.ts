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
    if (!this.currency.legend || !this.currency.symbol || this.currency.ic <= 0) {
      ErrorMessage('Por favor complete todos los campos correctamente.');
      return;
    }

    this.currencyService.createCurrency(this.currency).then(res => {
      this.close.emit(); 
      if (res) {
        SuccessMessage('Moneda creada correctamente.');
      } else {
        ErrorMessage('Error creando moneda.');
      }
    }).catch(error => {
      console.error(error);
      ErrorMessage('Hubo un error al intentar crear la moneda.');
    });
  }
}
