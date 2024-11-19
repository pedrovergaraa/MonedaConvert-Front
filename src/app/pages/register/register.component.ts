import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterData } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  
  authService = inject(AuthService);
  router = inject(Router);
  errorRegister: WritableSignal<boolean> = signal(false);

  registerData: RegisterData = {
    email: "",
    password: "",
    confirmPassword: "",
    userId: 0,
    attempts: 0,
    subscriptionId: 0,
    subscription: undefined,
    currencies: [],
    favoriteCurrencies: []
  };

  async register() {
    this.errorRegister.set(false);
    try {
      const res = await this.authService.register(this.registerData);
      if (res.ok) {
        this.router.navigate(["/login"]);
      } else {
        this.errorRegister.set(true);
      }
    } catch (err) {
      console.warn('Error registrando', err);
    }
  }
}
