import { required } from "@rxweb/reactive-form-validators";
import { config } from "rxjs";

export class Etapa {
    
    public iIdEtapa?: number;
    
    @required()
    public bActivo: boolean = true;

    @required()
    public sEtapa?: string;

    @required()
    public iEtapa?: number;

    @required()
    public sSvg?: string ="/assets/Imagenes/img-default.png";

    @required()
    public iTotalLotes: number = 0;

    @required()
    public bActive?: boolean = false;

}
