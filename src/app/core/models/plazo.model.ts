export class Plazo{
    
    public sPlazo: string = "";

    public iPlazo: number= 0;

    public sPrecioM2: number=0;

    public isValid() : boolean {
        if(this.iPlazo == 0 || this.sPlazo == "" || this.sPrecioM2 == 0) {
            return false;
        }
        return true;
    }
}
