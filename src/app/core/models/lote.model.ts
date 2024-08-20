export class Lote {
    public sNombre: string;
    public sEtapa: string;
    public sSuperficie: string;
    public sDimension: string;
    public objPlazos: any;
    public iMinEnganche: number;
    public sFotografia: string;

    constructor() {
        this.sNombre= "";
        this.sEtapa= "";
        this.sSuperficie= "867.49 ㎡";
        this.sDimension= "26 x 26 ㎡";
        this.iMinEnganche= 20;
        this.sFotografia= "./assets/Imagenes/8-5.jpg";
        this.objPlazos= [
            {
                iIdPlazo: 1,
                sPlazo: 'Contado',
                sPrecioM2: '800.00',
            },
            {
                iIdPlazo: 2,
                sPlazo: '12 meses',
                sPrecioM2: '1200.00',
            },
            {
                iIdPlazo: 3,
                sPlazo: '24 meses',
                sPrecioM2: '1400.00',
            },
            {
                iIdPlazo: 4,
                sPlazo: '36 meses',
                sPrecioM2: '1600.00',
            },
            {
                iIdPlazo: 5,
                sPlazo: '48 meses',
                sPrecioM2: '1800.00',
            }
        ]
    }
}
