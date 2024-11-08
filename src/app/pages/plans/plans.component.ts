// plans.component.ts
import { Component } from '@angular/core';
import { SubscriptionService, SubscriptionType } from '../../services/sub.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent {
  constructor(private subscriptionService: SubscriptionService, private router: Router) {}
  message: '';

  selectPlan(type: SubscriptionType) {
    this.subscriptionService.setSubscriptionType(type);
    const remainingAttempts = this.subscriptionService.getRemainingAttempts();
    
    // Redirigir al conversor con un mensaje
    this.router.navigate(['/converter'], {
      queryParams: {
        message: `Has seleccionado la suscripción ${type}. ${remainingAttempts === Infinity ? 
          'Intentos ilimitados' : remainingAttempts + ' intentos'}.`
      }
    });
  }
}
