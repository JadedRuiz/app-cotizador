import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {


  constructor(private http: HttpClient) {   }

  public SERVER_API = environment.API_URL;

  guardarReporteEvidencia(json : any){
    let url = this.SERVER_API+"reportes/guardarReporteEvidencia";
    return this.http.post( url, json )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }
}