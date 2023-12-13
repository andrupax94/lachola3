
type categoria='ficcion'|'cienciaFiccion'|'fantasia'|'terror'|'basadaEnHechosReales'|'realidadVirtual'
|'inteligenciaArtificial'|'animacion'|'estudiantil'|'tresD'|'biografica'|'noEspecificado'|'otros'|'experimental'
|'documental';
type tipo_metraje='cortometraje'|'mediometraje'|'largometraje';
type tipo_festival='a'|'b'|'c';
type fuente='festHome'|'movibeta'|'filmfreeway'|'shortfilmdepot'|'animationfestivals';
export type eventoP = {
    id:number
    tasa:number
    telefono:string
    fuente:fuente
    facebook:string
    correoElectronico:string
    nombre:string
    web:string
    instagram:string
    ubicacion:string
    youtube:string
    industrias:string
    fechaInicio:Date
    fechaLimite:Date
    imagen:string
    banner:string
    tipo_metraje:Set<tipo_metraje>
    twitterX:string
    descripcion:string
    tipo_festival:tipo_festival
    categoria:Set<categoria> // Propiedad opcional
  };
