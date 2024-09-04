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
  submitted = false;
  passwordTextType!: boolean;
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

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    // Validar formulario
    if (this.form.invalid) {
      return;
    }
    //Service login
    this._usrService.login(this.form.value)
    .subscribe((resp : any) => {
      if(resp.ok) {
        localStorage.setItem("token",resp.data);
        this._router.navigate(["/panel/proyectos"]);
      }else{
        Swal.fire("Ocurrio un problema",resp.data,"warning");
      }
    });
    
  }
}
