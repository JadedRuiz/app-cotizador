import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/models/auth.model';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

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

  constructor(private readonly _formBuilder: RxFormBuilder, private readonly _router: Router
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
    this._router.navigate(["/panel/proyectos"]);
  }
}
