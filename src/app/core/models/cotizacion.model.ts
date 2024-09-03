import { Lote } from "./lote.model";

export class Cotizacion {
    public sNombre: string;
    public sCorreo: string;
    public sTelefono: string;
    public sCiudad: string;
    public iIdLote: number;
    public iIdPlazo: number;
    public iEnganche: number;

    constructor() {
        this.sNombre= "";
        this.sCorreo= "";
        this.sTelefono= "";
        this.sCiudad= "";
        this.iIdLote= 0;
        this.iIdPlazo= 0;
        this.iEnganche= 0;
    }
}
