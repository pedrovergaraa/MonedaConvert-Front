import { Component, OnInit } from '@angular/core';
import { SubscriptionData } from 'src/app/interfaces/User';
import { Subscription } from '../../interfaces/Subscription';
import { SubscriptionService } from '../../services/sub.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  subscriptions: Subscription[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  async loadSubscriptions(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.subscriptions = await this.subscriptionService.getAllSubscriptions();
    } catch (error) {
      console.error('Error al cargar las suscripciones:', error);
      this.error = 'No se pudieron cargar las suscripciones.';
    } finally {
      this.loading = false;
    }
  }

  async updateSubscription(subscriptionId: number): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const userId = this.subscriptionService.auth.getUserId();
      const newSubscriptionData: SubscriptionData = { newSubscriptionId: subscriptionId };

      await this.subscriptionService.updateSubscription(newSubscriptionData);
      alert('¡Suscripción actualizada con éxito!');
      await this.loadSubscriptions(); // Recargar la lista para reflejar cambios si es necesario
    } catch (error) {
      console.error('Error al actualizar la suscripción:', error);
      this.error = 'No se pudo actualizar la suscripción.';
    } finally {
      this.loading = false;
    }
  }
}
