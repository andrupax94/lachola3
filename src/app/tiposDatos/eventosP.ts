
type categoria='ficcion'|'cienciaFiccion'|'fantasia'|'terror'|'basadaEnHechosReales'|'realidadVirtual'
|'inteligenciaArtificial'|'animacion'|'estudiantil'|'tresD'|'biografica'|'noEspecificado'|'otros'|'experimental'
|'documental';
type tipo_metraje='cortometraje'|'mediometraje'|'largometraje';
type tipo_festival='a'|'b'|'c';
type fuente='festHome'|'movibeta'|'filmfreeway'|'shortfilmdepot'|'animationfestivals';
export type eventoP = {
    id:number
    imagen:string
    nombre:string
    descripcion:string
    tasa:number
    categoria:Set<categoria> // Propiedad opcional
    tipo_metraje:Set<tipo_metraje>
    tipo_festival:tipo_festival
    fechaInicio:Date
    fechaLimite:Date
    banner:string
    telefono:string
    correoElectronico:string
    fuente:fuente,
    url:string,
    web:string
    facebook:string
    ubicacion:string
    instagram:string
    youtube:string
    industrias:string
    twitterX:string
  };
