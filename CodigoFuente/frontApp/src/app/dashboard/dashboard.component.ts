import { Component, OnInit, AfterViewInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from './dashboard.service';
import { ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
import { OverlayContainer } from '@angular/cdk/overlay';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  city: string = 'Cali';
  weatherData: any = { weather: [] };
  projectsTotal = 0;
  lastProjectDays = 0;
  projectsInDev = 0;
  ncTotal = 0;
  errorTotal = 0;
  lastErrorHours = 2;
  notificationReport: any = [];
  projects!: number;
  projectsDev!: number;
  pendingNC!: number;
  errorsDeploy: number = 0;
  cpuReport: any;
  reportCommits: any;
  username: string = '';
  private chart: Chart | undefined; // Aquí almacenamos la instancia del gráfico para destruirlo si es necesario.

  temp: any = null;  // Variable para la temperatura
  descripcion : any=null;

  offcanvasInstance: any;

  constructor(private weatherService: WeatherService, private dashboardService: DashboardService, private cdr: ChangeDetectorRef, private overlayContainer: OverlayContainer) { }

  ngOnInit(): void {

    // Obtener el elemento del Offcanvas


    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.username = user?.user || 'Usuario';
    this.loadDashboardData();
    this.loadWeather();
    this.dashboardService.getDashboardData().subscribe(data => {
      if (data.reportCommits) {
        this.createCommitsChart(data.reportCommits); // Se pasa el argumento correctamente
      }
    });
  }

  ngAfterViewInit(): void {
    this.dashboardService.getDashboardData().subscribe(
      (data) => {
        this.createServerChart(data.cpuReport); // Ahora pasamos los datos obtenidos
      },
      (error) => {
        console.error('Error al cargar datos de la CPU', error);
      }
    );
  }



  loadWeather() {
    this.temp = null;
    this.descripcion = null;
    console.log('Cargando clima de ' + this.city);
    this.weatherService.getCoordinates(this.city).subscribe({
      next: (coords) => {
        if (coords) {
          this.weatherService.getWeather(coords.lat, coords.lon).subscribe({
            next: (data) => {
              this.weatherData = JSON.stringify(data, null, 2)
              this.temp = data.temperatura;
              this.descripcion = data.descripcion;
              console.log("weatherData.", JSON.stringify(this.weatherData, null, 2)); // Mejora en la visualización
              this.cdr.detectChanges();  // Forzar la detección de cambios

            },
            error: (err) => console.error('Error al obtener clima', err)
          });
        }
      },
      error: (err) => console.error('Error al obtener coordenadas', err)
    });
  }


  // Crear gráfico del uso de la CPU
  createServerChart(cpuData: any) {
    if (!cpuData || !cpuData.time || cpuData.time.length === 0) return; // Validación de datos

    const ctx = document.getElementById('serverChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); // Destruir el gráfico anterior si existe
    }

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: cpuData.time.map((d: any) => d.time), // Fechas en el eje X
          datasets: [{
            label: 'Uso de CPU (%)',
            data: cpuData.time.map((d: any) => d.value), // Valores en el eje Y
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Fecha'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Porcentaje de Uso'
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    }
  }

  // Crear gráfico de commits
  createCommitsChart(reportCommits: any[]) {
    const months = reportCommits.map(item => `Mes ${item.month}`);
    const feats = reportCommits.map(item => item.feat);
    const fixes = reportCommits.map(item => item.fix);

    new Chart('commitsChart', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Features',
            data: feats,
            backgroundColor: '#33FF57'
          },
          {
            label: 'Fixes',
            data: fixes,
            backgroundColor: '#FF5733'
          }
        ]
      }
    });
  }

  // Convierte la fecha en "hace X días"
  calcularTiempo(fecha: string): string {
    return moment(fecha, "YYYY-MM-DD HH:mm:ss").fromNow();
  }

  closeModal() {
    this.overlayContainer.getContainerElement().classList.remove('cdk-overlay-container');
  }



//cargamos datos para la vista del dsahboard

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.projectsTotal = data.projects;
        this.projectsInDev = data.projectsDev;
        this.ncTotal = data.pendingNC;
        this.errorTotal = data.errorsDeploy;
        this.projects = data.projects;
        this.projectsDev = data.projects_dev;
        this.pendingNC = data.pendingNC;
        this.cpuReport = data.cpuReport;
        this.reportCommits = data.reportCommits;
        this.lastProjectDays=data.lastProjectDays;
        this.notificationReport = data.notification;
       console.log('Datos notificationReport:',   this.notificationReport);


        // Llamar a la función para crear la gráfica después de recibir los datos
        console.log('Creando gráfica de CPU' + this.cpuReport);
        this.createServerChart(this.cpuReport);
      },
      error: (err) => console.error('Error al obtener datos del dashboard', err)
    });
  }



  cerrarOffcanvas() {

    document.getElementById('offcanvasNotifications')?.classList.remove('show');
    document.body.classList.remove('offcanvas-backdrop'); // Elimina el fondo oscuro si queda activo

  }
}
