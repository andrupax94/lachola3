<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class eventosController extends Controller
{
    public function getEventos(Request $request)
    {
        $apiUrl = 'https://eduardoandres.000webhostapp.com/wp-json/wp/v2/eventos';
        $body = '?_fields=
        id,
        acm_fields.tasa,
        acm_fields.telefono,
        acm_fields.fuente,
        acm_fields.facebook,
        acm_fields.correoElectronico,
        acm_fields.nombre,
        acm_fields.web,
        acm_fields.instagram,
        acm_fields.ubicacion,
        acm_fields.youtube,
        acm_fields.industrias,
        acm_fields.fechaInicio,
        acm_fields.fechaLimite,
        acm_fields.url,
        acm_fields.imagen.media_details.sizes.full.source_url,
        acm_fields.banner.media_details.full.source_url,
        acm_fields.tipo_metraje,
        acm_fields.twitterX,
        acm_fields.descripcion,
        acm_fields.tipo_festival,
        acm_fields.categoria';
        $urlCompleta = $apiUrl . $body;
        // Hacer una solicitud GET
        $response = Http::withOptions(['verify' => false])
            ->get($urlCompleta);

        // Obtener el contenido de la respuesta en formato JSON
        $data = $response->json();
        $eventos = [];
        foreach ($data as $key => $evento) {
            $eventos[$key] = [];
            $eventos[$key]["id"] =$evento["id"];
            $eventos[$key]["tasa"] = isset($evento["acm_fields"]["tasa"]) ? $evento["acm_fields"]["tasa"] : "No especificado";
            $eventos[$key]["telefono"] = isset($evento["acm_fields"]["telefono"]) ? $evento["acm_fields"]["telefono"] : "No especificado";
            $eventos[$key]["fuente"] = isset($evento["acm_fields"]["fuente"]) ? $evento["acm_fields"]["fuente"] : "No especificado";
            $eventos[$key]["facebook"] = isset($evento["acm_fields"]["facebook"]) ? $evento["acm_fields"]["facebook"] : "No especificado";
            $eventos[$key]["correoElectronico"] = isset($evento["acm_fields"]["correoElectronico"]) ? $evento["acm_fields"]["correoElectronico"] : "No especificado";
            $eventos[$key]["nombre"] = isset($evento["acm_fields"]["nombre"]) ? $evento["acm_fields"]["nombre"] : "No especificado";
            $eventos[$key]["web"] = isset($evento["acm_fields"]["web"]) ? $evento["acm_fields"]["web"] : "No especificado";
            $eventos[$key]["url"] = isset($evento["acm_fields"]["url"]) ? $evento["acm_fields"]["url"] : "No especificado";
            $eventos[$key]["instagram"] = isset($evento["acm_fields"]["instagram"]) ? $evento["acm_fields"]["instagram"] : "No especificado";
            $eventos[$key]["ubicacion"] = isset($evento["acm_fields"]["ubicacion"]) ? $evento["acm_fields"]["ubicacion"] : "No especificado";
            $eventos[$key]["youtube"] = isset($evento["acm_fields"]["youtube"]) ? $evento["acm_fields"]["youtube"] : "No especificado";
            $eventos[$key]["industrias"] = isset($evento["acm_fields"]["industrias"]) ? $evento["acm_fields"]["industrias"] : "No especificado";
            $eventos[$key]["fechaInicio"] = isset($evento["acm_fields"]["fechaInicio"]) ? $evento["acm_fields"]["fechaInicio"] : "No especificado";
            $eventos[$key]["fechaLimite"] = isset($evento["acm_fields"]["fechaLimite"]) ? $evento["acm_fields"]["fechaLimite"] : "No especificado";
            $eventos[$key]["imagen"] = isset($evento["acm_fields"]["imagen"]["media_details"]["sizes"]["full"]["source_url"]) ? $evento["acm_fields"]["imagen"]["media_details"]["sizes"]["full"]["source_url"] : "No especificado";
            $eventos[$key]["banner"] = isset($evento["acm_fields"]["banner"]["media_details"]["full"]["source_url"]) ? $evento["acm_fields"]["banner"]["media_details"]["full"]["source_url"] : "No especificado";
            $eventos[$key]["tipo_metraje"] = isset($evento["acm_fields"]["tipo_metraje"]) ? $evento["acm_fields"]["tipo_metraje"] : "No especificado";
            $eventos[$key]["twitterX"] = isset($evento["acm_fields"]["twitterX"]) ? $evento["acm_fields"]["twitterX"] : "No especificado";
            $eventos[$key]["descripcion"] = isset($evento["acm_fields"]["descripcion"]) ? $evento["acm_fields"]["descripcion"] : "No especificado";
            $eventos[$key]["tipo_festival"] = isset($evento["acm_fields"]["tipo_festival"]) ? $evento["acm_fields"]["tipo_festival"] : "No especificado";
            $eventos[$key]["categoria"] = isset($evento["acm_fields"]["categoria"]) ? $evento["acm_fields"]["categoria"] : "No especificado";


            $eventos[$key]["tasa"]=($eventos[$key]["tasa"]==="") ? $eventos[$key]["tasa"] : "No Especificado";
            $eventos[$key]["telefono"]=($eventos[$key]["telefono"]==="") ? $eventos[$key]["telefono"] : "No Especificado";
            $eventos[$key]["fuente"]=($eventos[$key]["fuente"]==="") ? $eventos[$key]["fuente"] : "No Especificado";
            $eventos[$key]["facebook"]=($eventos[$key]["facebook"]==="") ? $eventos[$key]["facebook"] : "No Especificado";
            $eventos[$key]["correoElectronico"]=($eventos[$key]["correoElectronico"]==="") ? $eventos[$key]["correoElectronico"] : "No Especificado";
            $eventos[$key]["nombre"]=($eventos[$key]["nombre"]==="") ? $eventos[$key]["nombre"] : "No Especificado";
            $eventos[$key]["web"]=($eventos[$key]["web"]==="") ? $eventos[$key]["web"] : "No Especificado";
            $eventos[$key]["url"]=($eventos[$key]["url"]==="") ? $eventos[$key]["url"] : "No Especificado";
            $eventos[$key]["instagram"]=($eventos[$key]["instagram"]==="") ? $eventos[$key]["instagram"] : "No Especificado";
            $eventos[$key]["ubicacion"]=($eventos[$key]["ubicacion"]==="") ? $eventos[$key]["ubicacion"] : "No Especificado";
            $eventos[$key]["youtube"]=($eventos[$key]["youtube"]==="") ? $eventos[$key]["youtube"] : "No Especificado";
            $eventos[$key]["industrias"]=($eventos[$key]["industrias"]==="") ? $eventos[$key]["industrias"] : "No Especificado";
            $eventos[$key]["fechaInicio"]=($eventos[$key]["fechaInicio"]==="") ? $eventos[$key]["fechaInicio"] : "No Especificado";
            $eventos[$key]["fechaLimite"]=($eventos[$key]["fechaLimite"]==="") ? $eventos[$key]["fechaLimite"] : "No Especificado";
            $eventos[$key]["imagen"]=($eventos[$key]["imagen"]==="") ? $eventos[$key]["imagen"] : "No Especificado";
            $eventos[$key]["banner"]=($eventos[$key]["banner"]==="") ? $eventos[$key]["banner"] : "No Especificado";
            $eventos[$key]["tipo_metraje"]=($eventos[$key]["tipo_metraje"]==="") ? $eventos[$key]["tipo_metraje"] : "No Especificado";
            $eventos[$key]["twitterX"]=($eventos[$key]["twitterX"]==="") ? $eventos[$key]["twitterX"] : "No Especificado";
            $eventos[$key]["descripcion"]=($eventos[$key]["descripcion"]==="") ? $eventos[$key]["descripcion"] : "No Especificado";
            $eventos[$key]["tipo_festival"]=($eventos[$key]["tipo_festival"]==="") ? $eventos[$key]["tipo_festival"] : "No Especificado";
            $eventos[$key]["categoria"]=($eventos[$key]["categoria"]==="") ? $eventos[$key]["categoria"] : "No Especificado";

        }
        return $eventos;
        // Puedes manipular los datos según tus necesidades

    }
}
