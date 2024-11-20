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

  private selectedSubscription: Subscription | null = null;

  setSubscription(subscription: Subscription) {
    this.selectedSubscription = subscription;
  }

  getSubscription(): Subscription | null {
    return this.selectedSubscription;
  }

  clearSubscription() {
    this.selectedSubscription = null;
  }
  
  async getSub(userId: number) {
    if (!userId) {
      throw new Error("Invalid userId provided");
    }
  
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
  
    const subscription = await response.json();
    return subscription.AllowedAttempts;
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
