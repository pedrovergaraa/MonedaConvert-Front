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

  
  async getFavoriteCurrencies(userId: number): Promise<Currency[]> {
  try {
    const res = await fetch(API +`currency/favorites/${userId}`);
    
    if (res.ok) {
      return res.json(); 
    } else {
      const errorMessage = await res.text();
      throw new Error(`Error al obtener las monedas favoritas: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error en la solicitud a la API:', error);
    throw new Error('Hubo un problema al obtener las monedas favoritas.');
  }
}

  async getDefaultCurrencies(): Promise<any> {
    const res = await fetch('currency/defaultCurrencies');
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener las currencys por defecto');
  }

  async convert(amount: number, currencyFromId: number, currencyToId: number): Promise<any> {
    const url = `${API}currency/convert?amount=${amount}&currencyFromId=${currencyFromId}&currencyToId=${currencyToId}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });
  
      const result = await response.json();
      return result;
  
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      return "-2"; 
    }
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
