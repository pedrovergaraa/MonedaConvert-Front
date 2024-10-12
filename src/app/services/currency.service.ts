import { Injectable } from '@angular/core';
import { API } from '../constants/api';
import { ApiService } from './api.service';
import { Currency } from '../interfaces/Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends ApiService {
  
  // Función para verificar el plan del usuario
  async checkUserPlan(): Promise<string> {
    const plan = await (await this.getAuth("View/GetUserPlan")).text();
    return plan;
  }

  // Obtener la cantidad total de conversiones realizadas por el usuario
  async getTotalConversions(): Promise<number> {
    const total = await (await this.getAuth("View/GetTotalConversions")).text();
    return parseInt(total, 10);
  }

  // Función para realizar una conversión, respetando el límite del plan del usuario
  async convertCurrency(amount: number, fromCurrency: number, toCurrency: number): Promise<string | number> {
    const plan = await this.checkUserPlan();
    const totalConversions = await this.getTotalConversions();

    let conversionLimit = 0;

    if (plan === 'free') {
      conversionLimit = 10;
    } else if (plan === 'trial') {
      conversionLimit = 100;
    } else if (plan === 'premium') {
      conversionLimit = Infinity;
    }

    if (totalConversions >= conversionLimit) {
      return `You have reached your conversion limit for the ${plan} plan.`;
    }

    const url = `${API}Currency/Convert?amount=${amount}&fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });

      if (!response.ok) {
        console.error('Error in conversion request');
        return -2; // Custom status code
      }
  
      const result = await response.text();
      return result;
      
    } catch (error) {
      console.error('Error during conversion request');
      return -2;
    }
  }

  // Obtener monedas por defecto
  async getDefaultCurrencys(): Promise<Currency[]> {
    const response = await this.getAuth("View/GetDefaultCurrencys");
    return await response.json();
  }

  // Crear una nueva moneda
  async createCurrency(Currency: Currency): Promise<boolean> {
    if (Currency.id) return false;
    const res = await fetch(`${API}Currency/CreateCurrency`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(Currency)
    });
    return res.ok;
  }

  // Editar una moneda existente
  async editCurrency(Currency: Currency): Promise<boolean> {
    if (!Currency.id) return false;
    const url = `${API}Currency/EditCurrency?CurrencyId=${Currency.id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(Currency)
    });
    return res.ok;
  }

  // Eliminar una moneda
  async deleteCurrency(id: number): Promise<boolean> {
    const url = `${API}Currency/DeleteCurrency?CurrencyId=${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + this.auth.token()
      }
    });
    return res.ok;
  }

  // Agregar moneda a favoritos
  async addFavorite(Currency: Currency): Promise<boolean> {
    const res = await fetch(`${API}Currency/AddFavorite`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(Currency)
    });
    return res.ok;
  }

  // Eliminar moneda de favoritos
  async removeFavorite(CurrencyId: number): Promise<boolean> {
    const url = `${API}Currency/RemoveFavorite?CurrencyId=${CurrencyId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + this.auth.token()
      }
    });
    return res.ok;
  }

  // Ver monedas favoritas
  async getFavoriteCurrencys(): Promise<Currency[]> {
    const res = await this.getAuth("View/GetFavoriteCurrencys");
    return await res.json();
  }
}
