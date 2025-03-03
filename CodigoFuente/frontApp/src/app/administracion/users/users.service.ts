import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';
import { Role } from 'src/app/models/Role';
import { Project } from 'src/app/models/Project ';
import { CONSTANTS } from 'src/app/Util/Constantes';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

   apiUrlUsuarios = '';
   apiUrlRoles = '';
   apiProyectosUrl = '';

  constructor(private http: HttpClient) {
    // URL del JSON Server, URL de los usuarios, URL de los roles
    this.apiUrlUsuarios=CONSTANTS.URLUSUARIOS;
    this.apiUrlRoles=CONSTANTS.URLROLES;
    this.apiProyectosUrl=CONSTANTS.URLPROYECTOS;
   }



  // Obtener usuarios
  getUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrlUsuarios);
  }
  // Obtener roles
  getProyectos(): Observable<Project[]> {

    return this.http.get<Project[]>(this.apiProyectosUrl);

  }
  // Obtener roles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrlRoles);
  }

  // Eliminar usuario
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlUsuarios}/${id}`);
  }

  // Editar usuario (en este caso solo se muestra como ejemplo)
  editarUsuario(usuario: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrlUsuarios}/${usuario.id}`, usuario);
  }

  crearUsuario(usuario: User) {
    return this.http.post<User>(`${this.apiUrlUsuarios}`, usuario);
  }
}
