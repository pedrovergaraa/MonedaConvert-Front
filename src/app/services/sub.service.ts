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
        this.remainingAttempts = Infinity; // Ilimitados
        break;
    }
  }

  // Método para convertir y restar un intento
  // Método para convertir y restar un intento
async convert(amount: number, from: string, to: string): Promise<number> {
  // Verificamos si el usuario tiene intentos restantes según su plan
  if (this.subscriptionType !== 'Pro' && this.remainingAttempts <= 0) {
    throw new Error(`Conversion limit reached for ${this.subscriptionType} plan`);
  }

  try {
    // Hacemos la solicitud al backend para convertir la moneda
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

    // Si no es 'Pro', restamos un intento
    if (this.subscriptionType !== 'Pro') {
      this.remainingAttempts--;
    }

    // Devolvemos el resultado de la conversión
    return result.convertedAmount; // Suponiendo que el backend devuelve el monto convertido con el campo "convertedAmount"
  } catch (error) {
    console.error('Error en la conversión:', error);
    throw error;
  }
}

}
