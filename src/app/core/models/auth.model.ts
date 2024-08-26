import { required, email, password } from "@rxweb/reactive-form-validators";

export class Auth {
    
    @required()
    sUsuario?: string;

    @required()
    sContra?: string;
}
