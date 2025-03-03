import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { CONSTANTS } from '../Util/Constantes';
/**
 * Servicio de autenticación (AuthService).
 * Maneja la autenticación de usuarios, el almacenamiento de tokens y datos en localStorage,
 * y la verificación de roles.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Almacena los datos del usuario autenticado */
  private usuario: any = null;
  private apiURL: string = "";



  /**
   * Constructor del servicio de autenticación.
   * @param http Servicio HTTP para realizar peticiones a la API.
   * @param router Servicio de navegación para redirigir entre rutas.
   */
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage(); // Cargar usuario almacenado al iniciar el servicio
    this.apiURL = CONSTANTS.URLLOGIN;
  }

  /**
   * Inicia sesión verificando las credenciales del usuario en la API.
   * @param user Nombre de usuario ingresado.
   * @param password Contraseña ingresada.
   * @returns Un Observable con los datos del usuario autenticado o `null` si las credenciales son incorrectas.
   */
  login(user: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiURL}?user=${user}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            // Guardar token y datos del usuario en localStorage
            localStorage.setItem('token', 'fake-token');
            localStorage.setItem('usuario', JSON.stringify(users[0]));

            // Actualizar el objeto usuario en el servicio
            this.usuario = users[0];

            // Cargar usuario desde localStorage si es necesario
            this.loadUserFromLocalStorage();

            return users[0]; // Retorna el usuario autenticado
          } else {
            return null; // Retorna null si no hay coincidencia
          }
        })
      );
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns `true` si hay un token y datos de usuario en localStorage, de lo contrario, `false`.
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    console.log('Verificando autenticación - Token:', token, 'Usuario:', usuario);

    return token !== null && usuario !== null;
  }

  /**
   * Verifica si el usuario tiene un rol específico.
   * @param expectedRole Rol esperado (por ejemplo, "Admin" o "Dev").
   * @returns `true` si el usuario tiene el rol esperado, de lo contrario, `false`.
   */
  hasRole(expectedRole: string): boolean {
    if (!this.usuario) {
      this.loadUserFromLocalStorage();
    }

    console.log('Usuario en hasRole:', this.usuario);

    if (!this.usuario) return false;

    const userRoleId: number = this.usuario.user_id;

    console.log('ID del rol del usuario:', userRoleId);

    // Mapeo de roles basado en IDs
    const roles: Record<number, string> = {
      1: 'Admin',
      2: 'Dev'
    };

    const userRole = roles[userRoleId] || '';

    console.log(`Rol obtenido: ${userRole}, Rol esperado: ${expectedRole}`);

    return userRole === expectedRole;
  }

  /**
   * Cierra sesión eliminando el token y los datos del usuario almacenados.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuario = null;
    this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
  }

  /**
   * Obtiene los datos del usuario autenticado.
   * @returns Un objeto con los datos del usuario o `null` si no hay usuario autenticado.
   */
  getUser() {
    if (!this.usuario) {
      this.loadUserFromLocalStorage();
    }
    return this.usuario;
  }

  /**
   * Carga los datos del usuario desde el localStorage y los asigna a la variable `usuario`.
   */
  private loadUserFromLocalStorage(): void {
    const savedUser = localStorage.getItem('usuario');
    this.usuario = savedUser ? JSON.parse(savedUser) : null;
  }
}
