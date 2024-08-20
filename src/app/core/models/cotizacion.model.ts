import { Lote } from "./lote.model";

export class Cotizacion {
    public sNombre: string;
    public sCorreo: string;
    public sTelefono: string;
    public sCiudad: string;
    public iIdPlazo: number;
    public sPrecioM2: string;

    constructor() {
        this.sNombre= "";
        this.sCorreo= "";
        this.sTelefono= "";
        this.sCiudad= "";
        this.iIdPlazo= 0;
        this.sPrecioM2="";
    }
}
