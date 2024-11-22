import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { Router } from '@angular/router';
import { Subscription } from 'src/app/interfaces/Subscription'; 

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  subscriptionService = inject(SubscriptionService);
  router = inject(Router);

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  async loadSubscriptions() {
    try {
      this.subscriptions = await this.subscriptionService.getAllSubscriptions();
    } catch (err) {
      console.warn('Error loading subscriptions', err);
    }
  }

  async updateSubscription(subscription: Subscription) {
    try {
      const res = await this.subscriptionService.updateSubscription(subscription);
      if (res.ok) {
        // Almacena la suscripción seleccionada en el servicio compartido
        this.subscriptionService.getUserSubscription(subscription);
  
        // Redirige al conversor
        this.router.navigate(['/converter']);
      }
    } catch (err) {
      console.warn('Error updating subscription', err);
    }
  }
  
}
