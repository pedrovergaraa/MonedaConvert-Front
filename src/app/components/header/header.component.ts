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
    const currentRoute = this.router.url;
    if (!currentRoute.includes('login') && !currentRoute.includes('register')) {
      this.showBackButton = true;
    }
  }

  goBack() {
    window.history.back();
  }

  Logout() {
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
        this.auth.logOut();
        this.router.navigate(['/login']); 
      }
    });
  }
}
