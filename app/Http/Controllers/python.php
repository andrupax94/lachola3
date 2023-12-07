<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class python extends Controller
{
    public function extrae(Request $request)
    {
        $pagina = $request->input('pagina');
        switch($pagina){
            case "festhome":
            $url="https://festhome.com/festivals";
            break;
            case "google":
            $url="https://google.com";
            break;
            case "filmfreeway":
            $url="https://filmfreeway.com/festivals";
            break;
            default:
            $url=false;
            break;
        }
        if($url!==false){
        // Comando para ejecutar el script de Python con el parámetro
        $comando = "python c:/www/lachola/.py/extract.py $url";

        // Ejecutar el comando y obtener la salida
        $salida = shell_exec($comando);
        $response = json_decode($salida, true);
        // Puedes retornar la salida como una respuesta JSON
        return response()->json($response);

        }
        else{
            return response()->json('Url No Encontrada');
        }
    }
}
