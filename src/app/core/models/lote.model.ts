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
        this.iMinEnganche= 0;
        this.sFotografia= "./assets/Imagenes/8-5.jpg";
        this.objPlazos= [
            {
                sPlazo: 'Contado',
                sPrecioM2: '800.00',
            },
            {
                sPlazo: '12',
                sPrecioM2: '1200.00',
            },
            {
                sPlazo: '24',
                sPrecioM2: '1400.00',
            },
            {
                sPlazo: '36',
                sPrecioM2: '1600.00',
            },
            {
                sPlazo: '48',
                sPrecioM2: '1300.00',
            }
        ]
    }
}
