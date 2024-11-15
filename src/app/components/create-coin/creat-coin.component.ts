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
    id: 0,
    legend: '',
    symbol: '',
    ic: 0,
  }

  ngOnInit(): void {
    const message = localStorage.getItem('mensajeOkey');
    if (message) {
      ErrorMessage(message);
      localStorage.removeItem('mensajeOkey');
    }
  }
  
  onSubmit() {
    if (!this.currency.legend || !this.currency.symbol || this.currency.ic <= 0) {
      SuccessMessage('Por favor complete todos los campos correctamente.');
      return;
    }

    this.currencyService.createCurrency(this.currency).then(res => {
      this.close.emit();
      if (res) {
        localStorage.setItem('mensajeOkey', 'Creada correctamente');
        location.reload(); 
      } else {
        SuccessMessage('Error creando moneda');
      }
    });
  }
}
