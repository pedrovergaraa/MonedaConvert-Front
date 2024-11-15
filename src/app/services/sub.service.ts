// src/app/services/subscription.service.ts
import { Injectable } from '@angular/core';

export type SubscriptionType = 'Free' | 'Trial' | 'Pro';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  
  private subscriptionType: SubscriptionType = 'Free';
  private remainingAttempts: number = 10;

  constructor() {
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

async convert(amount: number, from: string, to: string): Promise<number> {
  if (this.subscriptionType !== 'Pro' && this.remainingAttempts <= 0) {
    throw new Error(`Conversion limit reached for ${this.subscriptionType} plan`);
  }

  try {
    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, from, to }),
    });

    if (!response.ok) {
      throw new Error('Error in conversion');
    }

    const result = await response.json();

    if (this.subscriptionType !== 'Pro') {
      this.remainingAttempts--;
    }

    return result.convertedAmount; 
  } catch (error) {
    console.error('Error en la conversión:', error);
    throw error;
  }
}

}
