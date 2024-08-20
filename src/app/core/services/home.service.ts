import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {


  constructor(private http: HttpClient) {   }

  public SERVER_API = environment.API_URL;

  getReports(){
    let url = this.SERVER_API+"admin/getReports";
    return this.http.get( url )
      .pipe(map( (resp: any) => {
        return resp;
      }), catchError(err => {
        return throwError(err);
      }));
  }
  
}