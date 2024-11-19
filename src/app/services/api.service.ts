import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { API } from '../constants/api';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  auth = inject(AuthService);
  constructor() { }

  async getAuth(endpoint: string) {
    const token = this.auth.token();  // Obtener el token desde AuthService
    if (!token) {
      console.error("Token is missing or invalid.");
      throw new Error("Token is missing or invalid.");
    }
  
    const res = await fetch(API + endpoint, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  
    if (res.status === 401) {
      this.auth.logOut();
    }
    return res;
  }
  
}
