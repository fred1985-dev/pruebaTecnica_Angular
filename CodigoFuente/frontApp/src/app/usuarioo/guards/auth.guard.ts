import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';


/**
 * AuthGuard: Protege rutas que requieren autenticación.
 * Implementa la interfaz `CanActivate` para permitir o bloquear el acceso a rutas protegidas.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /**
   * Constructor del guard de autenticación.
   * @param authService Servicio de autenticación para verificar si el usuario está autenticado.
   * @param router Servicio de navegación para redirigir al usuario en caso de no estar autenticado.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método que determina si el usuario puede activar la ruta protegida.
   * @returns `true` si el usuario está autenticado, `false` si no lo está y se le redirige al login.
   */
  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      console.log('AuthGuard: Usuario NO autenticado, redirigiendo a /login');
      this.router.navigate(['/login']); // Redirige al usuario al login si no está autenticado
      return false;
    }

    console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
    return true; // Permite el acceso si el usuario está autenticado
  }
}
