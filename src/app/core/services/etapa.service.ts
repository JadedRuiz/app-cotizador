import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lote } from '../models/lote.model';
import { Etapa } from '../models/etapa.model';

@Injectable({
  providedIn: 'root'
})
export class EtapaService {
    public SERVER_API = environment.API_URL;
    public arrayEtapas$ = new BehaviorSubject<any>([]);
    private readonly token= localStorage.getItem("token");
    public iIdProyecto= environment.iIdProyecto;

    constructor(
        private _http: HttpClient
    ) {}

    obtenerEtapas(){
        let url = this.SERVER_API+"getEtapas/"+this.iIdProyecto;
        return this._http.get( url )
          .pipe(map( (resp: any) => {
            return resp;
          }), catchError(err => {
            return throwError(err);
          }));
    }
}