import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Login } from '../models/Login ';
import Swal from 'sweetalert2';
/**
 * Componente de inicio de sesión (LoginComponent).
 * Permite a los usuarios autenticarse en la aplicación mediante un formulario.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Almacena el nombre de usuario ingresado en el formulario */
  username: string = '';

  /** Almacena la contraseña ingresada en el formulario */
  password: string = '';

  /** Mensaje de error para mostrar en caso de credenciales incorrectas */
  errorMessage: string = '';

  /** Objeto usuario que almacena los datos ingresados en el formulario */
  usuario: Login = new Login(); // Inicializa un nuevo objeto Login

  /**
   * Constructor del componente
   * @param authService Servicio de autenticación para validar credenciales
   * @param router Servicio de navegación para redirigir a otras rutas
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método que se ejecuta cuando el usuario intenta iniciar sesión.
   * Valida los campos y realiza la autenticación a través del servicio AuthService.
   */
  login() {
    // Validación: Verifica que ambos campos (usuario y contraseña) estén llenos
    if (!this.usuario.user || !this.usuario.password) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor, ingrese tanto el usuario como la contraseña.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    console.log(this.usuario.user + " " + this.usuario.password);

    // Llama al servicio de autenticación para validar las credenciales
    this.authService.login(this.usuario.user, this.usuario.password).subscribe(success => {
      if (success) {
        Swal.fire({
          icon: 'success',
          title: '¡Inicio de sesión exitoso!',
          text: `Bienvenido, ${this.usuario.user}!`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        // Redirige al usuario al dashboard y recarga la página para actualizar la sesión
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire('Login!', 'Usuario o contraseña incorrectos.', 'warning');
      }
    });
  }
}
