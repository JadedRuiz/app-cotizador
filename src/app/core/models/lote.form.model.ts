import { disable, required } from "@rxweb/reactive-form-validators";

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
    public iStatus?: number = 1;

    @required()
    public objPlazos: any = [];
}
