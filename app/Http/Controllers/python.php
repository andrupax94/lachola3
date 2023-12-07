<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\DomCrawler\Crawler;



class python extends Controller
{

    public function extrae2(Request $request){
        // Crear un cliente HTTP
        $client = HttpClient::create();

        // Hacer una solicitud HTTP
        $response = $client->request('GET', 'https://festhome.com');

        // Obtener el contenido de la respuesta
        $htmlContent = $response->getContent();

        // Crear un objeto Crawler para analizar el contenido HTML
        $crawler = new Crawler($htmlContent);

        // Ahora puedes usar el Crawler para seleccionar elementos HTML, por ejemplo, obtener el título
        $title = $crawler->filter('h1')->text();

        // Imprimir el título
        return "Título: $title";


    }
    public function extrae(Request $request)
    {
        $pagina = $request->input('pagina');
        switch($pagina){
            case "google":
            $url="google";
            break;
            case "festhome":
            $url="festhome";
            break;
            case "filmfreeway":
            $url="filmfreeway";
            break;
            default:
            $url=false;
            break;
        }
        if($url!==false){
           try{
        // Comando para ejecutar el script de Python con el parámetro
        $currentDirectory = __DIR__;
        // Construir la ruta a la raíz del proyecto
        $rootPath = realpath($currentDirectory . '/../../../.py/extract.py');
        $comando = "python $rootPath $url";

        // Ejecutar el comando y obtener la salida
        $salida = shell_exec($comando);
        $response = json_decode($salida, true);
        if (empty($response)) {
            return response()->json(FALSE);
        }
        // Puedes retornar la salida como una respuesta JSON
        return response()->json($response);
           }
           catch(exception $e){
                return response()->json('Error Al Obtener Datos De La Pagina');
           }
        }
        else{
            return response()->json(FALSE);
        }
    }
}
