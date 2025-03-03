import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/Project ';
import { CONSTANTS } from '../Util/Constantes';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private apiUrl = ''; // URL del JSON Server

  constructor(private http: HttpClient) {
    this.apiUrl=CONSTANTS.URLPROYECTOS;
  }

  // Obtener todos los proyectos
  getProyectos(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Obtener un proyecto por ID
  getProyectoById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }



  // Actualizar un proyecto existente
  updateProyecto(id: number, proyecto: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, proyecto);
  }

  // Eliminar un proyecto
  deleteProyecto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  crearProyecto(proyecto: any): Observable<any> {
    proyecto.status = 'En Desarrollo';

    return this.http.post(this.apiUrl, proyecto);
  }
}
