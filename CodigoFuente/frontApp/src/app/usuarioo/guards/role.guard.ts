import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
/**
 * RoleGuard: Guard de rutas que protege el acceso a ciertas rutas según el rol del usuario.
 * Implementa la interfaz `CanActivate` para permitir o denegar el acceso a rutas protegidas.
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  /**
   * Constructor del guard de roles.
   * @param authService Servicio de autenticación para verificar la autenticación y el rol del usuario.
   * @param router Servicio de navegación para redirigir al usuario si no tiene permisos.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método que determina si el usuario puede activar la ruta.
   * @param route Información sobre la ruta actual.
   * @param state Estado del enrutador en el momento de la navegación.
   * @returns `true` si el usuario tiene el rol adecuado, `false` si no tiene acceso.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verifica si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']); // Redirige al login si no está autenticado
      return false;
    }

    // Obtiene el rol esperado de la configuración de la ruta
    const expectedRole = route.data['role'] as string;

    // Verifica si el usuario tiene el rol requerido
    if (this.authService.hasRole(expectedRole)) {
      return true;
    }

    // Muestra una alerta indicando que el usuario no tiene acceso
    Swal.fire(
      'Acceso denegado',
      `Hola ${this.authService.getUser()?.user || 'Usuario'}, no tienes acceso a este recurso!`,
      'warning'
    );

    // Redirige a la página de inicio u otra ruta segura
    this.router.navigate(['/dashboard']);
    return false;
  }
}
