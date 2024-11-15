import Swal from 'sweetalert2';

export function SuccessMessage(messageText: string) {
  Swal.fire({
    title: messageText,
    timer: 2000,
    showConfirmButton: false,
    icon: 'success',
    toast: true,
    position: 'top',
    background: '#324E67', // Fondo oscuro
    color: 'white', // Texto blanco
    iconColor: '#4CAF50', // Icono verde
    customClass: {
      popup: 'swal2-rounded swal2-shadow', // Clases personalizadas
    },
  });
}

export function ErrorMessage(messageText: string) {
  Swal.fire({
    title: messageText,
    timer: 2000,
    showConfirmButton: false,
    icon: 'error',
    toast: true,
    position: 'top',
    background: '#324E67', // Fondo oscuro
    color: 'white', // Texto blanco
    iconColor: '#F44336', // Icono rojo
    customClass: {
      popup: 'swal2-rounded swal2-shadow', // Clases personalizadas
    },
  });
}
