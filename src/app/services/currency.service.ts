import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Currency } from '../interfaces/Currency';
import {API} from '../constants/api'

@Injectable({
  providedIn: 'root'
})

export class CurrencyService  extends ApiService {


  async getUserCurrencies(): Promise<Currency[]> {
    const res = await fetch(API + "currency/user", {
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

  async getFavoriteCurrencies(): Promise<any> {
    const res = await fetch(API + "currency/favorites", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
		});
		const data = await res.json();
		return data;
  }
  
  

  async getDefaultCurrencies(): Promise<any> {
    const res = await fetch(API + "currency/default", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
		});
		const data = await res.json();
		return data;
  }

  async getRemainingAttempts(userId: number): Promise<number> {
    const response = await fetch(API + `currency/remaining-conversions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });
  
    if (!response.ok) {
      throw new Error("Error al obtener los intentos restantes.");
    }
  
    const { remainingConversions } = await response.json(); // Asegúrate de que el nombre del campo coincida con la respuesta
    return remainingConversions;
}

  async convert(amount: number, fromCurrencyId: number, toCurrencyId: number): Promise<{ convertedAmount: number; remainingAttempts: number }> {
    const response = await fetch(API + `currency/convert`, {
      method: "POST",
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
  
    const { convertedAmount, remainingAttempts } = await response.json();
    return { convertedAmount, remainingAttempts };
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
    try {
      const res = await fetch(API + `currency/${currencyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error al eliminar la moneda:', errorData);
        return false; // Devuelve false si la eliminación falla
      }
  
      return true; // Si la respuesta es OK, devuelve true
    } catch (error) {
      console.error('Error en la solicitud DELETE:', error);
      throw new Error('Hubo un error al eliminar la moneda.');
    }
  }
  
  async addFavoriteCurrency(currencyId: number): Promise<boolean> {
    const res = await fetch(API + 'currency/addFavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token(),
      },
      body: JSON.stringify({ CurrencyId: currencyId }),
    });
  
    if (res.ok) {
      return true;
    } else {
      console.error('Error al agregar moneda favorita:', await res.text());
      return false;
    }
  }
  

  async removeFavoriteCurrency(currencyId: number): Promise<boolean> {
    const res = await fetch(API + `currency/favorite/${currencyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.auth.token(),
      },
    });

    return res.ok;
  }
}
