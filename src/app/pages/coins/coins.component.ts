import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.scss']
})
export class CoinsComponent implements OnInit {

  userCurrencies: Currency[] = [];
  favoriteCurrencies: Currency[] = [];
  defaultCurrencies: Currency[] = [];
  isCreateCoinModalOpen: boolean = false;

  
  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    try {
      this.userCurrencies = await this.currencyService.getUserCurrencies();
      this.favoriteCurrencies = await this.currencyService.getFavoriteCurrencies();
      this.defaultCurrencies = await this.currencyService.getDefaultCurrencies();
    } catch (error) {
      console.error('Error loading currencies:', error);
    }
  }

  openCreateCoinModal() {
    this.isCreateCoinModalOpen = true;
  }

  closeCreateCoinModal() {
    this.isCreateCoinModalOpen = false;
  }
}
