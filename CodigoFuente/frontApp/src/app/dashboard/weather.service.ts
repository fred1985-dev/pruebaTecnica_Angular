import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey: string = '9169f93ced248be4d821292aaa11022f';
  private weatherUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private geoUrl: string = 'https://api.openweathermap.org/geo/1.0/direct';

  constructor(private http: HttpClient) {}
  weatherData: any = {};


  /**
   * Obtiene las coordenadas de una ciudad dada.
   * @param cityName Nombre de la ciudad.
   * @returns Un Observable con la latitud y longitud de la ciudad.
   */

  getCoordinates(city: string): Observable<{ lat: number, lon: number }> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    return this.http.get<any[]>(url).pipe(
      map((data) => {
        if (data.length > 0) {
          console.log("weatherData", JSON.stringify(data, null, 2)); // Imprime el objeto completo de forma legible

          return { lat: data[0].lat, lon: data[0].lon };
        } else {
          throw new Error('No se encontraron coordenadas para la ciudad.');
        }
      })
    );
  }
  /**
   * Obtiene el clima actual basado en las coordenadas de la ciudad.
   * @param lat Latitud de la ciudad.
   * @param lon Longitud de la ciudad.
   * @returns Un Observable con los datos del clima.
   */
  getWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.weatherUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=es`;
    console.log("url....", url); // Imprime la URL de la petición
    return this.http.get<any>(url).pipe(
      map((data) => this.transformWeatherData(data))
    );
  }

  /**
   * Transforma los datos del clima de snake_case a camelCase.
   * @param data Datos del clima en formato original.
   * @returns Datos del clima con claves en formato camelCase.
   */
  private transformWeatherData(data: any): any {
    return {
      temperatura: data.main.temp,
      descripcion: data.weather[0].description,
      humedad: data.main.humidity,
      velocidadViento: data.wind.speed,
      icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      ciudad: data.name,
      pais: data.sys.country,
    };
  }
}
