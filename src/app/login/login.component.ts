import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/models/auth.model';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { AuthService } from '../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
  passwordTextType!: boolean;
  date= new Date().getFullYear();
  alertError = {
    message: '',
    show: false
  };

  constructor(
    private readonly _formBuilder: RxFormBuilder, 
    private readonly _router: Router,
    private _usrService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.formGroup(Auth);
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.alertError.show = false;
    this.loading = true;
    //Service login
    this._usrService.login(this.form.value)
    .subscribe((resp : any) => {
      if(resp.ok) {
        localStorage.setItem("token",resp.data);
        this._router.navigate(["/panel/proyectos"]);
      }else{
        this.loading = false;
        this.alertError = {
          show: true,
          message: resp.data
        };
      }
    }, (error) => {
      this.loading = false;
      this.alertError = {
        show: true,
        message: error.error.message
      };
    });
  }
}
