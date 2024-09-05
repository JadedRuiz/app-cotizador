import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

    constructor(private http: HttpClient) {   }

    public SERVER_API = environment.API_URL;
    private readonly token= localStorage.getItem("token");

    obtenerEtapasAdmin() {
        let url = this.SERVER_API+"admin/getEtapasAdmin";
        return this.http.post( url, { token : this.token } )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            return throwError(err);
        }));
    }

    obtenerLotesEtapaAdmin(iIdEtapa: number) {
        let url = this.SERVER_API+"admin/obtenerLotesEtapaAdmin";
        return this.http.post( url, { iIdEtapa: iIdEtapa, token : this.token } )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            return throwError(err);
        }));
    }

    cambiarStatusLote(json : any) {
        json.token = this.token; 
        let url = this.SERVER_API+"admin/cambiarStatusLote";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            return throwError(err);
        }));
    }

    obtenerCotizacionesLote(json : any) {
        json.token = this.token; 
        let url = this.SERVER_API+"admin/obtenerCotizacionesLote";
        return this.http.post( url, json )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            return throwError(err);
        }));
    }
}
