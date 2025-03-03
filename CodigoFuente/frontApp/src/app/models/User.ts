export class User {
  id: number=0;
  name: string='';
  last_name: string='';
  url_photo: string='';
  rol: number=0;
  list:  string[] = [];
  area: string='';
  projects: number[]=[]; // Agregamos la relación con proyectos

}
