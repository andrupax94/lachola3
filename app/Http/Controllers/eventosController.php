<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class eventosController extends Controller
{
    public function getEventos(Request $request){
        $apiUrl = 'https://eduardoandres.000webhostapp.com/wp-json/wp/v2/eventos';
        $body='?_fields=acm_fields.tasa,acm_fields.telefono,acm_fields.fuente,acm_fields.facebook,acm_fields.correoElectronico,acm_fields.nombre,acm_fields.web,acm_fields.instagram,acm_fields.ubicacion,acm_fields.youtube,acm_fields.industrias,acm_fields.fechaInicio,acm_fields.fechaLimite,acm_fields.imagen.media_details.sizes.full.source_url,acm_fields.banner.media_details.full.source_url,acm_fields.tipo_metraje,acm_fields.twitterX,acm_fields.descripcion,acm_fields.tipo_festival,acm_fields.categoria';
        $urlCompleta=$apiUrl.$body;
        // Hacer una solicitud GET
        $response = Http::withOptions(['verify' => false])
        ->get($urlCompleta);

        // Obtener el contenido de la respuesta en formato JSON
        $data = $response->json();
        return $data;
        // Puedes manipular los datos según tus necesidades

    }
}
