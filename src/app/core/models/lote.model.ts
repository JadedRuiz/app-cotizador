export class Lote {
    public iIdLote ?: number= 0;
    public iIdEtapa ?: number= 0;
    public iIdFoto ?: number= 0;
    public iLote ?: number= 0;
    public sTipoLote ?: string= "";
    public iSuperficie ?: number= 0;
    public bIrregular ?: boolean= true;
    public iAncho ?: number= 0;
    public iLargo ?: number= 0;
    public iPrecioM2Contado ?: number= 0;
    public iStatus ?: number= 1;
    public iUsuario ?: number= 0;
    public dtCreacion ?: Date= new Date();
    public dtMod ?: Date= new Date();
    public bActivo ?: number= 1;
}
