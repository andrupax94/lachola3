
type categoria = 'ficcion' | 'cienciaFiccion' | 'fantasia' | 'terror' | 'basadaEnHechosReales' | 'realidadVirtual'
    | 'inteligenciaArtificial' | 'animacion' | 'estudiantil' | 'tresD' | 'biografica' | 'noEspecificado' | 'otros' | 'experimental'
    | 'documental';
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
    categoria: Set<categoria> // Propiedad opcional
    tipoMetraje: Set<tipo_metraje>
    tipoFestival: tipo_festival
    banner: string
    fechaInicio: Date
    telefono: string
    descripcion: string
    correoElectronico: string
    web: string
    facebook: string
    instagram: string
    youtube: string
    industrias: string
    twitterX: string
};
