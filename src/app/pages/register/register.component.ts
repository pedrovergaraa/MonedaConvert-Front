import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterData } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

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
    confirmPassword: ""
  };

  isFormValid(): boolean {
    return (
      this.registerData.email !== "" &&
      this.registerData.password !== "" &&
      this.registerData.confirmPassword !== "" &&
      this.registerData.password === this.registerData.confirmPassword
    );
  }

  async register() {
    this.errorRegister.set(false);
    try {
      const res = await this.authService.register(this.registerData);
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ahora puedes iniciar sesión.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(["/login"]);
        });
      } else {
        this.errorRegister.set(true);
        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: 'Por favor, verifica tus datos y vuelve a intentarlo.',
          confirmButtonColor: '#d33'
        });
      }
    } catch (err) {
      console.warn('Error registrando', err);
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Por favor, intenta más tarde.',
        confirmButtonColor: '#d33'
      });
    }
  }
}
