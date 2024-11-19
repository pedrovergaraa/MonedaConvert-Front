import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { Router } from '@angular/router';
import { Subscription } from 'src/app/interfaces/Subscription'; // Importamos la interfaz Subscription

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  subscriptionService = inject(SubscriptionService);
  router = inject(Router);

  subscriptions: Subscription[] = []; // Tipamos la propiedad con la interfaz Subscription

  ngOnInit(): void {
    this.loadSubscriptions(); // Llamamos a la función para cargar las suscripciones al iniciar el componente
  }

  async loadSubscriptions() {
    try {
      this.subscriptions = await this.subscriptionService.getAllSubscriptions();
    } catch (err) {
      console.warn("Error loading subscriptions", err);
    }
  }

  async updateSubscription(subId: number) {
    try {
      const res = await this.subscriptionService.updateSubscription({
        subId,
        name: '',
        allowedAttempts: 0,
        price: 0
      });
      if (res.ok) {
        this.router.navigate(["/converter"]);
      }
    } catch (err) {
      console.warn("Error updating subscription", err);
    }
  }
}
