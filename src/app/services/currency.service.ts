import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Currency } from '../interfaces/Currency';
import {API} from '../constants/api'

@Injectable({
  providedIn: 'root'
})

export class CurrencyService  extends ApiService {


  async getUserCurrencies(): Promise<Currency[]> {
    const res = await fetch(API + "currency/all", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
		});
		const data = await res.json();
		return data;
  }

  async getCurrencyById(currencyId: number): Promise<Currency> {
		const res = await fetch(API + `currency/${currencyId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
		});
		const data = await res.json();
		return data;
	}

  getFavoriteCurrencies(userId: number): Promise<any> {
    return fetch(`https://localhost:7274/api/favorites/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al obtener las monedas favoritas: ${response.statusText}`);
        }
        return response.json();
      });
  }
  
  

  async getDefaultCurrencies(): Promise<any> {
    const res = await fetch('currency/defaultCurrencies');
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener las currencys por defecto');
  }


  
  async convert(amount: number, fromCurrencyId: number, toCurrencyId: number): Promise<number> {
    const response = await fetch(API + `currency/convert`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.auth.token()}`,
      },
      body: JSON.stringify({
        amount,
        fromCurrencyId,
        toCurrencyId,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Error en la conversión de monedas.");
    }
  
    const { convertedAmount } = await response.json();
    return convertedAmount;
  }
  
  async createCurrency(currency: Currency): Promise<boolean> {
    if (currency.currencyId) return false;
    const res = await fetch(API + 'currency/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify(currency),
    });

    return res.ok;
  }

  async editCurrency(currencyId: number, currency: Currency): Promise<boolean> {
    const res = await fetch(API + `currency/edit/${currencyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify(currency),
    });
  
    return res.ok;
  }
  

  async deleteCurrency(currencyId: number): Promise<boolean> {
    const res = await fetch(API + `currency/${currencyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });

    return res.ok;
  }

  async addFavoriteCurrency(currencyId: number): Promise<boolean> {
    const res = await fetch(API + 'currency/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify({ CurrencyId: currencyId }),
    });

    return res.ok;
  }

  async removeFavoriteCurrency(favoriteCurrencyId: number): Promise<boolean> {
    const res = await fetch(API + `currency/favorite/${favoriteCurrencyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });

    return res.ok;
  }
}
