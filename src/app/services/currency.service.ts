import { Injectable } from '@angular/core';
import { API } from '../constants/api';
import { ApiService } from './api.service';
import { Currency } from '../interfaces/Currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends ApiService {
  getCurrencyById(id: number) {
    throw new Error('Method not implemented.');
  }

  // Función para verificar el plan del usuario
  async checkUserPlan(): Promise<string> {
    const plan = await (await this.getAuth("View/GetUserPlan")).text();
    return plan;
  }

  // Función para ver y modificar la suscripción del usuario
  async modifyUserPlan(newPlan: string): Promise<boolean> {
    const res = await fetch(`${API}User/ModifyPlan`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify({ plan: newPlan })
    });
    return res.ok;
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
    if (plan === 'free') conversionLimit = 10;
    else if (plan === 'trial') conversionLimit = 100;
    else if (plan === 'premium') conversionLimit = Infinity;

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
        return -2;
      }
  
      const result = await response.text();
      return result;
      
    } catch (error) {
      console.error('Error during conversion request');
      return -2;
    }
  }

  // CRUD para Monedas

  // Obtener todas las monedas
  async getCurrencies(): Promise<Currency[]> {
    const res = await this.getAuth("Currency/GetAll");
    return await res.json();
  }



  // Crear una nueva moneda
  async createCurrency(currency: Currency): Promise<boolean> {
    if (currency.id) return false;
    const res = await fetch(`${API}Currency/CreateCurrency`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(currency)
    });
    return res.ok;
  }

  // Editar una moneda existente
  async editCurrency(currency: Currency): Promise<boolean> {
    if (!currency.id) return false;
    const url = `${API}Currency/EditCurrency?CurrencyId=${currency.id}`;
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

  // Favoritos

  // Agregar moneda a favoritos
  async addFavorite(currency: Currency): Promise<boolean> {
    const res = await fetch(`${API}Currency/AddFavorite`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token()
      },
      body: JSON.stringify(currency)
    });
    return res.ok;
  }

  // Eliminar moneda de favoritos
  async removeFavorite(currencyId: number): Promise<boolean> {
    const url = `${API}Currency/RemoveFavorite?CurrencyId=${currencyId}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: "Bearer " + this.auth.token()
      }
    });
    return res.ok;
  }

  // Ver monedas favoritas
  async getFavoriteCurrencies(): Promise<Currency[]> {
    const res = await this.getAuth("View/GetFavoriteCurrencies");
    return await res.json();
  }
}
