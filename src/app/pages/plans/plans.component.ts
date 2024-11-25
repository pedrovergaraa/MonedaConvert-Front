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
  currentSubscriptionId: number = 0; 

  SubscriptionUpdate: SubscriptionData = {
    newSubscriptionId: 0,
  };

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadCurrentSubscription(); 
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
      const userId = this.getUserId(); 
      const subscription = await this.subscriptionService.getUserSubscription(userId);
      this.currentSubscriptionId = subscription.subscriptionId; 
    } catch (err) {
      console.warn('Error loading current subscription', err);
    }
  }

  async updateSubscription(subscriptionId: SubscriptionData['newSubscriptionId']) {
    if (subscriptionId === this.currentSubscriptionId) {
      console.log('Comparing:', subscriptionId, this.currentSubscriptionId);

      Swal.fire({
        title: 'Already Subscribed',
        text: 'Ya tienes esta suscripción',
        icon: 'info',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.SubscriptionUpdate.newSubscriptionId = subscriptionId;
    try {
      const res = await this.subscriptionService.updateSubscription(this.SubscriptionUpdate);
      if (res.ok) {
        const data = await res.json();

        Swal.fire({
          title: 'Success!',
          text: 'Su suscripción ha sido actualizada con éxito',
          icon: 'success',
          confirmButtonText: 'Ir a la pantalla principal',
        }).then(() => {
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
    return parseInt(localStorage.getItem('userId') || '0', 10);
  }
}
