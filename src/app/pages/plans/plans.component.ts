import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/sub.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'src/app/interfaces/Subscription';
import { SubscriptionData } from 'src/app/interfaces/User';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  subscriptionService = inject(SubscriptionService);
  router = inject(Router);

  subscriptions: Subscription[] = [];
  currentSubscriptionId: number = 0; // Suscripción actual del usuario

  SubscriptionUpdate: SubscriptionData = {
    newSubscriptionId: 0,
  };

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadCurrentSubscription(); // Carga la suscripción actual
  }

  async loadSubscriptions() {
    try {
      this.subscriptions = await this.subscriptionService.getAllSubscriptions();
    } catch (err) {
      console.warn('Error loading subscriptions', err);
    }
  }

  async loadCurrentSubscription() {
    try {
      const userId = this.getUserId(); // Obtén el ID del usuario (puedes ajustarlo según cómo lo manejes)
      const subscription = await this.subscriptionService.getUserSubscription(userId);
      this.currentSubscriptionId = subscription.subscriptionId; // Asigna el ID de la suscripción actual
    } catch (err) {
      console.warn('Error loading current subscription', err);
    }
  }

  async updateSubscription(subscriptionId: SubscriptionData['newSubscriptionId']) {
    if (subscriptionId === this.currentSubscriptionId) {
      console.log('Comparing:', subscriptionId, this.currentSubscriptionId);

      // Validación: Ya tiene esta suscripción
      Swal.fire({
        title: 'Already Subscribed',
        text: 'You already have this subscription.',
        icon: 'info',
        confirmButtonText: 'OK',
      });
      return; // Detener el proceso de actualización
    }

    this.SubscriptionUpdate.newSubscriptionId = subscriptionId;
    try {
      const res = await this.subscriptionService.updateSubscription(this.SubscriptionUpdate);
      if (res.ok) {
        const data = await res.json();

        // Notificación de éxito
        Swal.fire({
          title: 'Success!',
          text: 'Your subscription has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'Go to Converter',
        }).then(() => {
          // Redirigir al usuario
          this.router.navigate(['/converter']);
        });
      }
    } catch (err: any) {
      console.error('Error updating subscription', err);

      // Notificación de error
      Swal.fire({
        title: 'Error',
        text: 'Failed to update subscription. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  private getUserId(): number {
    // Implementa esta función para obtener el ID del usuario (según tu lógica de autenticación)
    return parseInt(localStorage.getItem('userId') || '0', 10);
  }
}
