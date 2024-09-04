import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {   }

  public SERVER_API = environment.API_URL;

  login(credentials : any){
    let url = this.SERVER_API+"usuario/login";
    return this.http.post( url, credentials )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}