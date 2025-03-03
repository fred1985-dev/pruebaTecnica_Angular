import  {Component} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarioo/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header-standalone/./header-standalone.component.css'],
})
export class HeaderComponent{
  title: string ='pruebaPractica'
  isAdmin = false;
  constructor(private router: Router, public authService: AuthService) {

  }


  ngOnInit(): void {

    this.isAdmin = this.authService.hasRole('Admin');
  }
  logout(): void {
    let username = this.authService.login.name;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username} has cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }



}



