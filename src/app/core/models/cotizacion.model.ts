import { Lote } from "./lote.model";

export class Cotizacion {
    public sNombre: string;
    public sCorreo: string;
    public sTelefono: string;
    public sCiudad: string;
    public iIdLote: number;

    constructor() {
        this.sNombre= "";
        this.sCorreo= "";
        this.sTelefono= "";
        this.sCiudad= "";
        this.iIdLote= 0;
    }
}
