// src/app/services/subscription.service.ts
import { Injectable } from '@angular/core';
import { API } from '../constants/api';
import { ApiService } from './api.service';
import { Subscription } from '../interfaces/Subscription';
export type SubscriptionType = 'Free' | 'Trial' | 'Pro';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService  extends ApiService {


  async getSub(userId: number) {
    const response = await fetch(API + `subscription/userSub/${userId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this.auth.token(),
      },
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const subscription = await response.json(); // Cambié a .json() para obtener un objeto
    return subscription.AllowedAttempts; // Esto te devuelve los intentos restantes
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
  
    const subscriptions: Subscription[] = await response.json(); // Aseguramos que la respuesta es un array de tipo Subscription
    return subscriptions;
  }
  
  

  async updateSubscription(newSubscriptionId: Subscription) {
		const res = await fetch(API + `subscription/change`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
				Authorization: "Bearer " + this.auth.token(),
			},
			body: JSON.stringify(newSubscriptionId),
		});
		return res;
	}

  


}
