import { required } from "@rxweb/reactive-form-validators";

export class PlazoForm {
    
    @required()
    public sPlazo!: string;

    @required()
    public iPlazo!: string;

    @required()
    public sPrecioM2!: string;
}
