import { required } from "@rxweb/reactive-form-validators";
import { PlazoForm } from "./plazo.form.model";
import { Lote } from "./lote.model";
import { FormGroup } from "@angular/forms";

export class LoteForm {
    
    @required()
    public sLote!: string;

    public sTipoLote!: string;

    @required()
    public sSuperficie !: string;

    @required()
    public sAncho!: number;

    @required()
    public sLargo!: number;

    @required()
    public iMinEnganche: string = "%20";

    @required()
    public bActivo?: boolean = true;
}
