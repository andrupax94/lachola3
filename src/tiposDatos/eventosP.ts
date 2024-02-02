
type categoria = 'ficcion' | 'cienciaFiccion' | 'fantasia' | 'terror' | 'basadaEnHechosReales' | 'realidadVirtual'
    | 'inteligenciaArtificial' | 'animacion' | 'estudiantil' | 'tresD' | 'biografica' | 'otros' | 'experimental'
    | 'documental' | 'No Especificado' | 'No Especificada' | 'noEspecificado';
type tipo_metraje = 'cortometraje' | 'mediometraje' | 'largometraje';
type tipo_festival = 'a' | 'b' | 'c';
type fuente = 'festHome' | 'movibeta' | 'filmfreeway' | 'shortfilmdepot' | 'animationfestivals' | 'JSON LOCAL';
type tasa = {
    bool: number;
    text: string;
};
type fechalimite = {
    varias: boolean;
    fecha: Date;
}
export type eventoP = {
    id: number
    imagen: string
    nombre: string
    tasa: tasa
    fechaLimite: fechalimite
    url: string,
    check: boolean
    fuente: fuente,
    ubicacion: string
    ubicacionFlag: string
    categoria: Set<categoria> // Propiedad opcional
    tipoMetraje: Set<tipo_metraje>
    tipoFestival: tipo_festival
};
