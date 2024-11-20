import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService = inject(AuthService)
  router = inject(Router);
  errorLogin = signal(false);

  loginData: LoginData = {
    email: "",
    password: ""
  }
  
  isFormValid(): boolean {
    return this.loginData.email !== "" && this.loginData.password !== "";
  }

  login() {
    this.errorLogin.set(false);
    this.authService.login(this.loginData).then(res => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: 'Bienvenido de nuevo.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(["/"]);
        });
      } else {
        this.errorLogin.set(true);
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Email o contraseña incorrectos. Por favor, intenta nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    }).catch(err => {
      console.warn('Error iniciando sesión', err);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ocurrió un error inesperado. Por favor, intenta más tarde.',
        confirmButtonColor: '#d33'
      });
    });
  }
}
