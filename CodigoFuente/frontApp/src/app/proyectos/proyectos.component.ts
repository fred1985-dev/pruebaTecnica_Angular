import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProyectosService } from './proyectos.service';
import { Project } from '../models/Project ';
import * as $ from 'jquery'
import Swal from 'sweetalert2';
//Forzar Angular Material a usar el overlayContainer del modal
import { OverlayContainer } from '@angular/cdk/overlay';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectoForm!: FormGroup;

  listaDesarrolladores = [
    { id: 1, name: 'Dev 1' },
    { id: 2, name: 'Dev 2' },
    { id: 3, name: 'Dev 3' }
  ];



  listaFrontend = ['Angular', 'React', 'Vue'];
  listaBackend = ['NodeJS', '.NET', 'Spring Boot'];
  listaBasesDatos = ['PostgreSQL', 'MySQL', 'SQL Server'];

  proyectos: Project[] = [];

  constructor(
    private proyectosService: ProyectosService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private overlayContainer: OverlayContainer
  ) {}

  developerFilter: string = '';
  developersFiltrados = [...this.listaDesarrolladores];

  filtrarDesarrolladores() {
    this.developersFiltrados = this.listaDesarrolladores.filter(dev =>
      dev.name.toLowerCase().includes(this.developerFilter.toLowerCase())
    );
  }

  ngOnInit(): void {
    this.cargarProyectos();
    this.inicializarFormulario();
    this.developersFiltrados = [...this.listaDesarrolladores]
  }

  inicializarFormulario() {
    this.proyectoForm = this.fb.group({
      project_name: ['', [Validators.required, Validators.minLength(3)]],
      client: ['', [Validators.required, Validators.minLength(3)]],
      repo_url: ['', [Validators.pattern('https?://.+')]],
      ci: [false],
      cd: [false],
      developers: [[], Validators.required],
      frontend_tecnology: [[]],
      backend_tecnology: [[]],
      databases: [[]]
    });

  }

  cargarProyectos(): void {
    this.proyectosService.getProyectos().subscribe(data => {
      this.proyectos = data;
    });
  }

  eliminarProyecto(id: number): void {
    this.proyectosService.deleteProyecto(id).subscribe(() => {
      this.proyectos = this.proyectos.filter(p => p.id !== id);
    });
  }

  abrirModalNuevoProyecto() {
    this.proyectoForm.reset({
      project_name: '',
      client: '',
      repo_url: '',
      ci: false,
      cd: false,
      developers: [],
      frontend_tecnology: [],
      backend_tecnology: [],
      databases: []
    });

    setTimeout(() => {
      let modal = new bootstrap.Modal(document.getElementById('modalNuevoProyecto')!);
      modal.show();
      this.cd.detectChanges(); // Forzar la actualización de la UI
    }, 500);
  }

  crearProyecto() {
    if (this.proyectoForm.invalid) {
      this.proyectoForm.markAllAsTouched(); // Marca todos los campos como "tocados"
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor completa todos los campos obligatorios.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const nuevoProyecto = {
      ...this.proyectoForm.value,
      warning_count: 0,
      errors_count: 0,
      deploy_count: 0,
      percentage_completion: 0,
      report_nc: 0,
      status: 'En Desarrollo'
    };

    this.proyectosService.crearProyecto(nuevoProyecto).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Proyecto creado exitosamente',
        confirmButtonColor: '#3085d6'
      });

      this.cargarProyectos(); // Recargar lista de proyectos
      let modal = document.getElementById('modalNuevoProyecto')!;
      bootstrap.Modal.getInstance(modal)?.hide(); // Cierra el modal correctamente
    });
  }

  campoEsInvalido(campo: string): boolean {
    const control = this.proyectoForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }
}
