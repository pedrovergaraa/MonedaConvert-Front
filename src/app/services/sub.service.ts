// src/app/services/subscription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type SubscriptionType = 'Free' | 'Trial' | 'Pro';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private subscriptionType: SubscriptionType = 'Free';
  private remainingAttempts: number = 10;

  constructor(private http: HttpClient) {
    this.updateAttemptsBasedOnSubscription();
  }

  setSubscriptionType(type: SubscriptionType) {
    this.subscriptionType = type;
    this.updateAttemptsBasedOnSubscription();
  }

  getSubscriptionType(): SubscriptionType {
    return this.subscriptionType;
  }

  getRemainingAttempts(): number {
    return this.remainingAttempts;
  }

  private updateAttemptsBasedOnSubscription() {
    switch (this.subscriptionType) {
      case 'Free':
        this.remainingAttempts = 10;
        break;
      case 'Trial':
        this.remainingAttempts = 100;
        break;
      case 'Pro':
        this.remainingAttempts = Infinity;
        break;
    }
  }

  async convert(amount: number, from: number, to: number): Promise<number> {
    try {
      const response = await this.http.post<number>('/api/convert', { amount, from, to }).toPromise();
      if (this.subscriptionType !== 'Pro' && this.remainingAttempts > 0) {
        this.remainingAttempts--;
      }
      return response;
    } catch (error) {
      console.error('Error en la conversión:', error);
      return -2; // Código para error o condición particular
    }
  }
}
