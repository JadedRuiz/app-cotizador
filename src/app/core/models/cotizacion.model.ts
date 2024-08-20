import { Lote } from "./lote.model";

export class Cotizacion {
    public lote : Lote;
    public sNombre: string;
    public sCorreo: string;
    public sTelefono: string;

    constructor() {
        this.lote= new Lote();
        this.sNombre= "";
        this.sCorreo= "";
        this.sTelefono= "";
    }
}
