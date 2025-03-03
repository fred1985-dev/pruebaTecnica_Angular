import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './users.service';
import { Role } from 'src/app/models/Role';
import { User } from 'src/app/models/User';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuthService } from 'src/app/usuarioo/auth.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  usuarioForm!: FormGroup; // Formulario reactivo para la creación de usuarios

  usuarios: User[] = []; // Array que almacena la lista de usuarios
  roles: Role[] = []; // Array que almacena la lista de roles
  isAdmin = false; // Variable para verificar si el usuario tiene permisos de administrador
  projects: any[] = []; // Array que almacena la lista de proyectos

  // Inyección de dependencias para el servicio de usuarios, creación de formularios y autenticación
  constructor(private usuarioService: UsuarioService, private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    // Verifica si el usuario tiene rol de 'Admin'
    this.isAdmin = this.authService.hasRole('Admin');
    console.log("isAdmin", this.isAdmin);

    console.log(localStorage.getItem(''));

    // Carga la lista de usuarios desde el servicio
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data.map(usuario => ({
        ...usuario,
        list: usuario.list ? String(usuario.list).split('|') : [] // Convierte la lista en un array si existe
      }));
    });

    // Carga la lista de roles desde el servicio
    this.usuarioService.getRoles().subscribe(data => {
      this.roles = data;
    });

    // Carga la lista de proyectos desde el servicio
    this.usuarioService.getProyectos().subscribe(data => {
      this.projects = data;
      setTimeout(() => console.log("Proyectos actualizados:", this.projects), 2000);
    });

    // Inicialización del formulario reactivo con validaciones
    this.usuarioForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // Nombre del usuario
      last_name: ['', [Validators.required, Validators.minLength(3)]], // Apellido del usuario
      rol: ['', Validators.required], // Rol del usuario (obligatorio)
      list: ['', [Validators.required, Validators.minLength(2)]], // Lista de tecnologías asociadas
      area: ['', [Validators.required, Validators.minLength(3)]] // Área de trabajo del usuario
    });
  }

  /**
   * Verifica si un campo del formulario es inválido
   * @param campo Nombre del campo a verificar
   * @returns true si el campo es inválido y ha sido tocado
   */
  campoEsInvalido(campo: string): boolean {
    return this.usuarioForm.controls[campo].invalid && this.usuarioForm.controls[campo].touched;
  }

  /**
   * Obtiene el nombre de un proyecto a partir de su ID
   * @param id Identificador del proyecto
   * @returns Nombre del proyecto o 'Desconocido' si no se encuentra
   */
  obtenerNombreProyecto(id: number): string {
    const proyecto = this.projects.find(p => p.id == id);
    return proyecto ? proyecto.project_name : 'Desconocido' + id;
  }

  /**
   * Elimina un usuario de la lista y del backend
   * @param id Identificador del usuario a eliminar
   */

  eliminarUsuario(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(id).subscribe(() => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        });
      }
    });
  }

  /**
   * Función para editar un usuario
   * @param usuario Usuario que se desea editar
   */
  editarUsuario(usuario: User): void {
    console.log('Editar usuario', usuario);
    // Aquí se implementaría la lógica para editar un usuario
  }

  /**
   * Obtiene el nombre del rol basado en su ID
   * @param rolId Identificador del rol
   * @returns Nombre del rol o 'Desconocido' si no se encuentra
   */
  obtenerRol(rolId: number): string {
    const rol = this.roles.find(r => r.id == rolId);
    return rol ? rol.name : 'Desconocido';
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  abrirModalNuevoUsuario() {
    // Cargar roles si aún no se han cargado
    if (this.roles.length === 0) {
      this.usuarioService.getRoles().subscribe(data => {
        this.roles = data;
      });
    }

    // Reiniciar el formulario antes de abrir el modal
    this.usuarioForm.reset({
      name: '',
      last_name: '',
      rol: '', // Inicializa el rol en vacío
      list: [], // Inicializa la lista de tecnologías vacía
      area: ''
    });

    // Esperar un momento antes de abrir el modal (para evitar posibles problemas de renderizado)
    setTimeout(() => {
      let modal = new bootstrap.Modal(document.getElementById('modalNuevoUsuario'));
      modal.show();
    }, 500);
  }

  /**
   * Crea un nuevo usuario a partir del formulario y lo envía al backend
   */
  crearUsuario() {
    // Validar si el formulario es inválido antes de enviar
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched(); // Resalta los errores en el formulario
      return;
    }

    // Crear el objeto con la información del usuario
    const nuevoUsuario = {
      ...this.usuarioForm.value,
      warning_count: 0,
      errors_count: 0,
      deploy_count: 0,
      percentage_completion: 0,
      report_nc: 0,
      status: 'En Desarrollo'
    };

    // Enviar el usuario al backend
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Usuario creado exitosamente',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          // Cerrar el modal después de la confirmación
          let modalElement = document.getElementById('modalNuevoUsuario');
          let modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
          this.usuarioForm.reset(); // Limpia el formulario después de la creación
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el usuario. Intente nuevamente.',
          confirmButtonColor: '#d33'
        });
        console.error('Error al crear usuario:', err);
      }
    });
  }
}
