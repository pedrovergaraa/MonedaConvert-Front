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
    const res = await this.getAuth(`Currency/GetCurrencyById?CurrencyId=${id}`);
    if (res.ok) {
      return await res.json();
    } else {
      throw new Error('Error fetching currency');
    }
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
  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<string | number> {
    const remainingAttempts = this.subscriptionService.getRemainingAttempts();

    if (remainingAttempts <= 0) {
      return `You have reached your conversion limit for the ${this.subscriptionService.getSubscriptionType()} plan.`;
    }

    try {
      // Realiza la conversión si hay intentos restantes
      const convertedAmount = await this.subscriptionService.convert(amount, fromCurrency, toCurrency);
      return convertedAmount;
    } catch (error) {
      console.error('Error in conversion:', error);
      return 'There was an error during the conversion process.';
    }
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

  async getUserCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("Currency/GetUserCurrencies");
    return await res.json();
  }

  // Obtener monedas favoritas
  async getFavoriteCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("View/GetFavoriteCurrencies");
    return await res.json();
  }

  // Obtener monedas por defecto
  async getDefaultCurrencies(): Promise<Currency[]> {
    const res = await this.apiService.getAuth("Currency/GetAll");
    return await res.json();
  }
}
