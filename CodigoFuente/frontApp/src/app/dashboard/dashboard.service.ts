import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/dashboard_cards';
  private apiCpureport = 'http://localhost:3000/cpu_report';
  private apiReportCommi = 'http://localhost:3000/report_commits';
  private apiNotifica = 'http://localhost:3000/notification';

  weatherData: any = { weather: [] }
  constructor(private http: HttpClient) {}

  private transformKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        acc[camelKey] = this.transformKeysToCamelCase(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }



  getDashboardData(): Observable<any> {
    return forkJoin({
      dashboard: this.http.get<any>(this.apiUrl),
      cpuReport: this.http.get<any>(this.apiCpureport),
      reportCommits: this.http.get<any>(this.apiReportCommi),
      notification: this.http.get<any>(this.apiNotifica)
    }).pipe(
      map(({ dashboard, cpuReport, reportCommits, notification }) => ({
        projects: dashboard.projects,
        projectsDev: dashboard.projects_dev,
        pendingNC: dashboard.peding_nc,
        errorsDeploy: dashboard.errors_deploy,
        cpuReport: cpuReport,
        reportCommits: reportCommits,
        lastProjectDays: dashboard.last_project_days,
        notification: notification
      }))
    );
  }

}
