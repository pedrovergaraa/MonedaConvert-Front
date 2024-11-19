import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { API } from '../constants/api'; // Verifica que la constante API esté configurada correctamente

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  auth = inject(AuthService);

  constructor() { }

  async getAuth(endpoint: string) {
    try {
      const url = `${API}${endpoint}`;
      console.log('URL construida:', url);  // Depura aquí
  
      const token = this.auth.token();
      if (!token) {
        throw new Error('Token de autenticación no encontrado');
      }
  
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
  
      if (res.status === 401) {
        this.auth.logOut();
        throw new Error('No autorizado, sesión cerrada');
      }
  
      if (!res.ok) {
        throw new Error(`Error en la solicitud: ${res.statusText}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error('Error en getAuth:', error);
      throw error;
    }
  }
  
}
