import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lote } from '../models/lote.model';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
    public SERVER_API = environment.API_URL;
    public lote$ = new BehaviorSubject<any>(new Lote());  
    private readonly token= localStorage.getItem("token");

    constructor(
        private _http: HttpClient
    ) {}

    guardarLote(formdata : FormData) {
        formdata.append("token",this.token+""); 
        let url = this.SERVER_API+"admin/lote/guardarLote";
        return this._http.post( url, formdata )
        .pipe(map( (resp: any) => {
            return resp;
        }), catchError(err => {
            return throwError(err);
        }));
    }
}