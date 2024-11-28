// src/app/services/subscription.service.ts
import { Injectable } from '@angular/core';
import { API } from '../constants/api';
import { ApiService } from './api.service';
import { Subscription } from '../interfaces/Subscription';
import { SubscriptionData } from '../interfaces/User';
export type SubscriptionType = 'Free' | 'Trial' | 'Pro';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService  extends ApiService {

  async getUserSubscription(userId: number): Promise<Subscription> {
    try {
      const response = await fetch(API + `subscription/userSub/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.auth.token(),
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Asegúrate de que la respuesta tenga el formato esperado
      const subscription: Subscription = await response.json();
      if (!subscription) {
        throw new Error('La respuesta no contiene una suscripción válida');
      }
  
      return subscription; // Siempre retorna un objeto de tipo Subscription
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error; // Si ocurre un error, se lanza para manejarlo externamente
    }
  }
  
  async getAllSubscriptions(): Promise<Subscription[]> {
    const response = await fetch(API + `subscription/all`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token(),
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const subscriptions: Subscription[] = await response.json();
    return subscriptions;
  }
  
  

  async updateSubscription(newSubscriptionId: SubscriptionData) {
		const res = await fetch(API + `subscription/update`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
			body: JSON.stringify(newSubscriptionId),
		});
		return res;
	}

  


}
