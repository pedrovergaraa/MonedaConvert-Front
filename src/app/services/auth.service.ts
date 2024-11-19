import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData, RegisterData } from '../interfaces/User';
import { API } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);

  // Almacenar el token como WritableSignal
  token: WritableSignal<string | null> = signal(null);

  constructor() {
    // Recuperar el token almacenado en el localStorage al iniciar
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token.set(savedToken);  // Establecer el token al valor almacenado
    }
  }

  // Método para obtener el token actual
  getToken(): string | null {
    return this.token();  // Devuelve el valor actual del signal token
  }

  // Obtener el ID del usuario desde localStorage
  getUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;  // Devuelve el userId o 0 si no está presente
  }

  // Método para loguearse
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
      const tokenRecibido = await res.text();
      localStorage.setItem('token', tokenRecibido);  // Almacenar el token en el localStorage
      this.token.set(tokenRecibido);  // Establecer el token en el signal
      return true;
    } catch {
      return false;
    }
  }

  // Método para registrarse
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

  // Método para cerrar sesión
  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.token.set(null);  // Limpiar el token en el servicio
    this.router.navigate(['/login']);
  }
}
