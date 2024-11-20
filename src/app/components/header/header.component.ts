import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  auth = inject(AuthService);
  router = inject(Router);
  
  showBackButton: boolean = false;

  ngOnInit() {
    // Verificar si la ruta actual no es de login o register
    const currentRoute = this.router.url;
    if (!currentRoute.includes('login') && !currentRoute.includes('register')) {
      this.showBackButton = true;
    }
  }

  goBack() {
    // Navegar hacia atrás en el historial
    window.history.back();
  }

  Logout() {
    // Mostrar un modal de confirmación antes de hacer logout
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, hacer el logout
        this.auth.logOut();
        this.router.navigate(['/login']); // Redirigir al login o a la página deseada
      }
    });
  }
}
