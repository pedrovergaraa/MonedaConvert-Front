import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { Currency } from '../interfaces/Currency';
import {API} from '../constants/api'

@Injectable({
  providedIn: 'root'
})

export class CurrencyService  extends ApiService {

  apiService = inject(ApiService);

  async getAllCurrencies(): Promise<any> {
    const res = await this.apiService.getAuth('currency/all');
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener las currencys');
  }

  async getUserCurrencies(): Promise<any> {
    const res = await this.apiService.getAuth('currency/all'); // Suponiendo que "all" trae todas las monedas
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener las monedas del usuario');
  }
  

  async getCurrencyById(currencyId: number): Promise<any> {
    const res = await this.apiService.getAuth(`currency/${currencyId}`);
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener la currency');
  }

  async getFavoriteCurrencies(userId: number): Promise<Currency[]> {
  try {
    const res = await this.apiService.getAuth(`currency/favorites/${userId}`);
    
    if (res.ok) {
      return res.json(); // Asume que la respuesta es un arreglo de objetos Currency
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
    const res = await this.apiService.getAuth('currency/defaultCurrencies');
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error al obtener las currencys por defecto');
  }

  async convert(amount: number, toConvert: any): Promise<any> {
    const res = await this.apiService.getAuth(`currency/convert?amount=${amount}&CurrencyFromId=${toConvert.CurrencyFromId}&CurrencyToId=${toConvert.CurrencyToId}`);
    if (res.ok) {
      return res.json();
    }
    throw new Error('Error en la conversión de currency');
  }

  async createCurrency(currency: Currency): Promise<boolean> {
    if (currency.id) return false;
    const res = await fetch(API + 'currency/create', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
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
        'Content-type': 'application/json',
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
        'Content-type': 'application/json',
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
