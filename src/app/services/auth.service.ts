import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../interfaces/User';
import { API } from '../constants/api';

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

  async login(loginData: LoginData): Promise<boolean> {
    try {
      const res = await fetch(API + 'authentication/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      if (!res.ok) return false;
  
      // Parsear la respuesta JSON
      const responseBody = await res.json();  // Aquí se obtiene el objeto completo
  
      // Acceder al token dentro del objeto
      const receivedToken = responseBody.token;  // Aquí accedes al campo `token`
  
      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
        this.token.set(receivedToken);  // Guardar el token en el estado de Angular
        return true;
      } else {
        console.error("Token no recibido en la respuesta");
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
    localStorage.removeItem('userId');
    this.token.set(null);  
    this.router.navigate(['/login']);
  }
}
