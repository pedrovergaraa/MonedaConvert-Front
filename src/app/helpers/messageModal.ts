import Swal from 'sweetalert2';

export function SuccessMessage(messageText: string) {
  Swal.fire({
    title: messageText,
    timer: 2000,
    showConfirmButton: false,
    icon: 'success',
    toast: true,
    position: 'top',
    background: '#324E67', 
    color: 'white', 
    iconColor: '#4CAF50', 
    customClass: {
      popup: 'swal2-rounded swal2-shadow', 
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
    background: '#324E67', 
    color: 'white', 
    iconColor: '#F44336', 
    customClass: {
      popup: 'swal2-rounded swal2-shadow', 
    },
  });
}
