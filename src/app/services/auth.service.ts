import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../interfaces/User';
import { API } from '../constants/api';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  token: WritableSignal<string | null> = signal(null);

  constructor() {
    this.token.set(localStorage.getItem('token'));
   }

  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;  
  }

  private showHeaderAndFooter = new BehaviorSubject<boolean>(true);
  showHeaderAndFooter$ = this.showHeaderAndFooter.asObservable();

  setVisibility(visible: boolean) {
    this.showHeaderAndFooter.next(visible);
  }

  async login(loginData: LoginData): Promise<boolean> {
  try {
    const res = await fetch(API + 'authentication/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!res.ok) {
      console.error("Error al autenticar:", res.statusText);
      return false;
    }
    const responseBody = await res.json();
    const receivedToken = responseBody.token;
    const userId = responseBody.userId; 

    if (receivedToken && userId) {
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('userId', userId.toString());
      this.token.set(receivedToken);
      return true;
    } else {
      console.error("Datos faltantes en la respuesta del backend");
      return false;
    }
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    return false;
  }
}

  async register(registerData: RegisterData) {
    const res = await fetch(API + 'user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });
    return res;
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Limpia también el userId
    this.token.set(null);
    this.router.navigate(['/login']);
  }
}
