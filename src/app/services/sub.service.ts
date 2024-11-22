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

  async getUserSubscription(userId) {
    const apiUrl = `${API}subscription/userSub/${userId}`; 

    try {
        const response = await fetch(apiUrl, {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const subscription = await response.json();
        return subscription;
    } catch (error) {
        console.error('Error fetching subscription:', error);
        throw error;
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
