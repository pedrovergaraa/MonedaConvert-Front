import { Injectable, Inject, inject } from '@angular/core';
import { API } from '../constants/api';
import { ApiService } from './api.service';
import { Currency } from '../interfaces/Currency';
import { SubscriptionService } from './sub.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends ApiService {

  apiService = inject(ApiService)

  @Inject(SubscriptionService) subscriptionService: SubscriptionService;

  async getCurrencyById(id: number): Promise<Currency> {
    const res = await this.getAuth(`currency/${id}`);
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error('Error fetching currency');
    }
  }
  

  async checkUserPlan(): Promise<string> {
    const plan = await (await this.getAuth("subscription/userSub")).text();
    return plan;
  }

  async modifyUserPlan(newPlan: string): Promise<boolean> {
    const res = await fetch(`${API}subscription/change`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify({ plan: newPlan })
    });
    return res.ok;
  }

  async getTotalConversions(): Promise<number> {
    const total = await (await this.getAuth("currency/convert")).text();
    return parseInt(total, 10);
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<string | number> {
    const remainingAttempts = this.subscriptionService.getRemainingAttempts();

    if (remainingAttempts <= 0) {
      return `You have reached your conversion limit for the ${this.subscriptionService.getSubscriptionType()} plan.`;
    }

    try {
      const convertedAmount = await this.subscriptionService.convert(amount, fromCurrency, toCurrency);
      return convertedAmount;
    } catch (error) {
      console.error('Error in conversion:', error);
      return 'There was an error during the conversion process.';
    }
  }


  async createCurrency(currency: Currency): Promise<boolean> {
    if (currency.id) return false;
    const res = await fetch(`${API}currency/create`, { 
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token() 
      },
      body: JSON.stringify(currency)
    });
    return res.ok;
  }

  async editCurrency(currency: Currency): Promise<boolean> {
    if (!currency.id) return false;
    const url = `${API}currency/edit/${currency.id}`;  
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(currency)
    });
    return res.ok;
  }

  async deleteCurrency(id: number): Promise<boolean> {
    const url = `${API}currency/${id}`;  
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + this.auth.token()
      }
    });
    return res.ok;
  }


  async addFavorite(currency: Currency): Promise<boolean> {
    const res = await fetch(`${API}currency/favorite`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(currency)
    });
    return res.ok;
  }

  async removeFavorite(currencyId: number): Promise<boolean> {
    const url = `${API}currency/favorite?CurrencyId=${currencyId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + this.auth.token()
      }
    });
    return res.ok;
  }

  async getUserCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("currency/all");
    return await res.json();
  }

  async getFavoriteCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("currency/favorites");
    return await res.json();
  }

  async getDefaultCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("currency/defaultCurrencies");  
    return await res.json();
  }
}
