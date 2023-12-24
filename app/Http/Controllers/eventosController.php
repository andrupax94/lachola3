<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;
use Symfony\Component\HttpClient\HttpClient;
require_once('../resources/views/fv/funciones.php');
use misFunciones;

class eventosController extends Controller
{

    private function extractImageUrl($style)
    {
        $matches = [];
        preg_match('/\bhttps?:\/\/\S+\b/', $style, $matches);
        return $matches ? $matches[0] : 'No Especificado';
    }
    public function extractFestivalData(Request $request)
    {

            Cache::put('procesing', 'iniciando', 60);
            // Establecer el indicador de bloqueo
            sleep(2);
            Cache::put('procesing', 'iniciando2', 60);


            $pages = null !== $request->input('pages') ? (int) $request->input('pages') : 1;
            $festivalPage = null !== $request->input('festivalPage') ? $request->input('festivalPage') : "No Especificado";

            $dataTotal = [];
            $data = [];
            switch ($festivalPage) {
                case 'festhome':
                    $client = HttpClient::create([
                        'verify_peer' => true,
                        'cafile' => 'C:/laragon/etc/ssl/cacert.pem', // Ajusta la ruta según tu configuración
                    ]);
                    $response = $client->request('GET', 'https://festhome.com/festival-list/page:' . $pages);
                    // Obtener el contenido de la respuesta
                    $htmlContent = $response->getContent();
                    // Crear un objeto Crawler para analizar el contenido HTML
                    $crawler = new Crawler($htmlContent);
                    $festivals = $crawler->filter('#card_contents .card-container');
                    // Obtener el nuevo estado de la página después del clic

                    foreach ($festivals as $festival) {

                        $festivalCrawler = new Crawler($festival);

                        // Extrae los datos que necesitas para cada festival
                        $title = $festivalCrawler->filter('.festival-card-title')->count() ? $festivalCrawler->filter('.festival-card-title')->text() : 'No Especificado';
                        $country = $festivalCrawler->filter('.festival-card-country')->count() ? $festivalCrawler->filter('.festival-card-country')->text() : 'No Especificado';

                        // Extrae las duraciones
                        $durations = [];
                        $festivalCrawler->filter('.festival-card-type-holder .festival-card-type')->each(function ($durationNode) use (&$durations) {
                            $durations[] = $durationNode->text();
                        });

                        // Extrae las URLs de las imágenes

                        // Extrae la URL de la imagen
                        $imageFront = ($festivalCrawler->filter('.festival-card.card-front')->count()) ?
                        $this->extractImageUrl($festivalCrawler->filter('.festival-card.card-front')->attr('style')) : "No Especificado";

                        if ($imageFront === 'No Especificado') {
                            $imageFront = $festivalCrawler->filter('.festival-card-logo_new')->count() ?
                            $festivalCrawler->filter('.festival-card-logo_new')->attr('src') : 'No Especificado';
                        }

                        $imageBanner = $festivalCrawler->filter('.festival-card-banner')->count() ?
                        $this->extractImageUrl($festivalCrawler->filter('.festival-card-banner')->attr('style')) : 'No Especificado';

                        // Agrega la URL de redirección y la tasa
                        $redirectUrl = $festivalCrawler->filter('.festival-card-outer div:last-child a')->count()
                        ? 'https://filmmakers.festhome.com/festival/' . $festivalCrawler->filter('.festival-card-outer div:last-child a')->attr('data-full_url')
                        : 'No Especificado';

                        $fees = [];
                        $festivalCrawler->filter('.info_icon.fa-stack.fa-lg:nth-child(3)')->each(function ($feeNode) use (&$fees) {
                            $matches = [];
                            preg_match_all('/([\w\s]+): ([\d.]+)€/', $feeNode->attr('title'), $matches, PREG_SET_ORDER);

                            if (!empty($matches)) {
                                $fees[$matches[0][1]] = $matches[0][2];
                            }
                        });

                        // Si no hay tasas, establece '0'
                        $fees = empty($fees) ? '0' : $fees;

                        // Agrega la fecha límite
                        $deadline = $festivalCrawler->filter('.festival-card-status.days .date')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.festival-card-status.days .date')->text(),4) : 'No Especificado';

                        // Añade más campos según sea necesario
                        $data[] = [
                            'title' => $title,
                            'country' => $country,
                            'duration' => $durations,
                            'image_front' => $imageFront,
                            'image_banner' => $imageBanner,
                            'redirect_url' => $redirectUrl,
                            'fees' => $fees,
                            'deadline' => $deadline,
                            // Añade más campos según sea necesario
                        ];

                    }
                    $dataTotal = $dataTotal + $data;
                    break;
                case 'movibeta':
                    $client = HttpClient::create([
                        'verify_peer' => false,
                        // 'verify_peer_name' => false,
                    ]);
                    $response = $client->request('GET', 'https://festival.movibeta.com/festivals?page='.$pages);
                        $content = $response->getContent();

                        $crawler = new Crawler($content);
                        sleep(10);
                        $festivals = [];
                        $crawler->filter('#app')->html();
                        $crawler->filter('table tbody tr')->each(function (Crawler $row) use (&$festivals) {
                            $festival = [
                                'imagen' => $row->filter('td:nth-child(1) img')->attr('src'),
                                'nombre' => $row->filter('td:nth-child(1) h6')->text(),
                                'tasa' => (int) $row->filter('td:nth-child(4)')->text(),
                                'fechaLimite' => \DateTime::createFromFormat('d/m/Y', $row->filter('td:nth-child(6)')->text()),
                                'url' => $row->filter('td:nth-child(7) a')->attr('href'),
                                'fuente' => 'movibeta',
                                'ubicacion' => $row->filter('td:nth-child(4)')->text(),
                            ];

                            $festivals[] = $festival;
                        });

                        $dataTotal = $dataTotal + $festivals;

                    break;
                case 'animation-festivals':

                    $client = HttpClient::create([
                        'verify_peer' => false,
                        'cafile' => 'C:/laragon/etc/ssl/cacert.pem', // Ajusta la ruta según tu configuración
                    ]);
                    $response = $client->request('GET', 'https://www.animation-festivals.com/festivals-list/page/'.$pages);
                    // Obtener el contenido de la respuesta
                    $htmlContent = $response->getContent();
                    // Crear un objeto Crawler para analizar el contenido HTML
                    $crawler = new Crawler($htmlContent);
                    $festivals = $crawler->filter('#festival-list li');

                    foreach ($festivals as $festival) {

                        $festivalCrawler = new Crawler($festival);

                        // Extrae los datos que necesitas para cada festival
                        $title = $festivalCrawler->filter('h2 a')->count() ? $festivalCrawler->filter('h2 a')->text() : 'No Especificado';
                        $country = $festivalCrawler->filter('.country')->count() ? $festivalCrawler->filter('.country')->text() : 'No Especificado';

                        // Extrae las duraciones
                        $durations = ['No Especificado'];
                        // $festivalCrawler->filter('.festival-card-type-holder .festival-card-type')->each(function ($durationNode) use (&$durations) {
                        //     $durations[] = $durationNode->text();
                        // });

                        // Extrae las URLs de las imágenes

                        // Extrae la URL de la imagen
                        $imageFront = ($festivalCrawler->filter('.boxShadowForMobile a img')->count()) ?
                        $this->extractImageUrl($festivalCrawler->filter('.boxShadowForMobile a img')->attr('src')) : "No Especificado";

                        if ($imageFront === 'No Especificado') {
                            $imageFront = $festivalCrawler->filter('.festival-card-logo_new')->count() ?
                            $festivalCrawler->filter('.festival-card-logo_new')->attr('src') : 'No Especificado';
                        }

                        $imageBanner = 'No Especificado';

                        // Agrega la URL de redirección y la tasa
                        $redirectUrl = $festivalCrawler->filter('.links-info>a')->count()
                        ?  $festivalCrawler->filter('.links-info>a')->attr('href')
                        : 'No Especificado';

                        $feesAux=$festivalCrawler->filter('.cost')->count()
                        ?  $festivalCrawler->filter('.cost')->text('')
                        : 'No Especificado';
                        $fees = [$feesAux];


                        // Si no hay tasas, establece '0'
                        $fees = empty($fees) ? '0' : $fees;

                        // Agrega la fecha límite
                        $deadline = $festivalCrawler->filter('.submit-info .dates span')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.submit-info .dates span')->text(),4) : 'No Especificado';

                        // Añade más campos según sea necesario
                        $data[] = [
                            'title' => $title,
                            'country' => $country,
                            'duration' => $durations,
                            'image_front' => $imageFront,
                            'image_banner' => $imageBanner,
                            'redirect_url' => $redirectUrl,
                            'fees' => $fees,
                            'deadline' => $deadline,
                            // Añade más campos según sea necesario
                        ];

                    }
                    $dataTotal = $dataTotal + $data;
                    break;

                    default:
                Cache::forget('procesing');

                    return response()->json([
                        'codigo' => 0,
                        'mensaje' => 'Pagina No Soportada',
                    ], 500);
                    break;
            }
            // Itera sobre cada festival y extrae los datos

            // Puedes devolver los datos como respuesta o hacer lo que necesites con ellos
            Cache::forget('procesing');
            return response()->json(['status' => true, 'data' => $dataTotal]);
        }

    public function getEventos(Request $request)
    {
        Cache::put('procesing', 'iniciando', 60);
            // Establecer el indicador de bloqueo
            sleep(2);
        Cache::put('procesing', 'iniciando2', 60);
        $apiUrl = 'https://eduardoandres.000webhostapp.com/wp-json/wp/v2/eventos';
        $page = $request->input('page');
        $orderby = 'acm_fields.' . $request->input('orderby');
        $per_page = $request->input('per_page');
        $order = $request->input('order');

        $params = [
            '_fields' => 'id,acm_fields.tasa,acm_fields.telefono,acm_fields.fuente,acm_fields.facebook,acm_fields.correoElectronico,acm_fields.nombre,acm_fields.web,acm_fields.instagram,acm_fields.ubicacion,acm_fields.youtube,acm_fields.industrias,acm_fields.fechaInicio,acm_fields.fechaLimite,acm_fields.imagen.media_details.sizes.full.source_url,acm_fields.banner.media_details.full.source_url,acm_fields.tipo_metraje,acm_fields.twitterX,acm_fields.descripcion,acm_fields.tipo_festival,acm_fields.categoria,acm_fields.url',
            'page' => $page,
            'per_page' => $per_page,
            'orderby' => $orderby,
            'order' => $order,
        ];

        // Construir la URL con los parámetros
        $url = $apiUrl . '?' . http_build_query($params);
        // Hacer una solicitud GET
        $response = Http::withOptions(['verify' => false])
            ->get($url);

        // Obtener el contenido de la respuesta en formato JSON
        $data = $response->json();
        $eventos = [];
        foreach ($data as $key => $evento) {
            $eventos[$key] = [];
            $eventos[$key]["id"] = $evento["id"];
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

            $eventos[$key]["tasa"] = ($eventos[$key]["tasa"] !== "") ? $eventos[$key]["tasa"] : "No Especificado";
            $eventos[$key]["telefono"] = ($eventos[$key]["telefono"] !== "") ? $eventos[$key]["telefono"] : "No Especificado";
            $eventos[$key]["fuente"] = ($eventos[$key]["fuente"] !== "") ? $eventos[$key]["fuente"] : "No Especificado";
            $eventos[$key]["facebook"] = ($eventos[$key]["facebook"] !== "") ? $eventos[$key]["facebook"] : "No Especificado";
            $eventos[$key]["correoElectronico"] = ($eventos[$key]["correoElectronico"] !== "") ? $eventos[$key]["correoElectronico"] : "No Especificado";
            $eventos[$key]["nombre"] = ($eventos[$key]["nombre"] !== "") ? $eventos[$key]["nombre"] : "No Especificado";
            $eventos[$key]["web"] = ($eventos[$key]["web"] !== "") ? $eventos[$key]["web"] : "No Especificado";
            $eventos[$key]["url"] = ($eventos[$key]["url"] !== "") ? $eventos[$key]["url"] : "No Especificado";
            $eventos[$key]["instagram"] = ($eventos[$key]["instagram"] !== "") ? $eventos[$key]["instagram"] : "No Especificado";
            $eventos[$key]["ubicacion"] = ($eventos[$key]["ubicacion"] !== "") ? $eventos[$key]["ubicacion"] : "No Especificado";
            $eventos[$key]["youtube"] = ($eventos[$key]["youtube"] !== "") ? $eventos[$key]["youtube"] : "No Especificado";
            $eventos[$key]["industrias"] = ($eventos[$key]["industrias"] !== "") ? $eventos[$key]["industrias"] : "No Especificado";
            $eventos[$key]["fechaInicio"] = ($eventos[$key]["fechaInicio"] !== "") ? $eventos[$key]["fechaInicio"] : "No Especificado";
            $eventos[$key]["fechaLimite"] = ($eventos[$key]["fechaLimite"] !== "") ? $eventos[$key]["fechaLimite"] : "No Especificado";
            $eventos[$key]["imagen"] = ($eventos[$key]["imagen"] !== "") ? $eventos[$key]["imagen"] : "No Especificado";
            $eventos[$key]["banner"] = ($eventos[$key]["banner"] !== "") ? $eventos[$key]["banner"] : "No Especificado";
            $eventos[$key]["tipo_metraje"] = ($eventos[$key]["tipo_metraje"] !== "") ? $eventos[$key]["tipo_metraje"] : "No Especificado";
            $eventos[$key]["twitterX"] = ($eventos[$key]["twitterX"] !== "") ? $eventos[$key]["twitterX"] : "No Especificado";
            $eventos[$key]["descripcion"] = ($eventos[$key]["descripcion"] !== "") ? $eventos[$key]["descripcion"] : "No Especificado";
            $eventos[$key]["tipo_festival"] = ($eventos[$key]["tipo_festival"] !== "") ? $eventos[$key]["tipo_festival"] : "No Especificado";
            $eventos[$key]["categoria"] = ($eventos[$key]["categoria"] !== "") ? $eventos[$key]["categoria"] : "No Especificado";
            $headers = get_headers($url, 1);
            if (isset($headers['X-WP-TotalPages'])) {
                $totalPages = (int) $headers['X-WP-TotalPages'];

            } else {
                $totalPages = 'El encabezado X-WP-TotalPages no está presente en la respuesta.';
            }
        }
        Cache::forget('procesing');
        return ['eventos' => $eventos, 'totalPages' => $totalPages];
        // Puedes manipular los datos según tus necesidades

    }
    public function getEventosJ(Request $request)
    {
        Cache::put('procesing', 'iniciando', 60);
            // Establecer el indicador de bloqueo
            // sleep(2);
        Cache::put('procesing', 'iniciando2', 60);
        $jsonFilePath = public_path('../src/assets/eventosP.json');

// Verificar si el archivo existe antes de intentar leerlo
if (file_exists($jsonFilePath)) {
    // Leer el contenido del archivo JSON
    $jsonContent = file_get_contents($jsonFilePath);

    // Decodificar el JSON a un array o un objeto según tus necesidades
    $data = json_decode($jsonContent, true); // true para obtener un array asociativo

    // Ahora `$data` contiene la información del archivo JSON
    // Puedes trabajar con la variable `$data` según tus necesidades
}

        // Obtener el contenido de la respuesta en formato JSON

        $eventos = [];
        foreach ($data as $key => $evento) {
            $eventos[$key] = [];
            $eventos[$key]["id"] = $evento["Id_evento"];
            $eventos[$key]["imagen"] = $evento["Imagen"];
            $eventos[$key]["nombre"] = $evento["Nombre"];
            $eventos[$key]["tasa"] = $evento["Tasa"];
            $eventos[$key]["fuente"] = $evento["Fuente"];
            $eventos[$key]["facebook"] = $evento["Facebook"];
            $eventos[$key]["fechaLimite"] = $evento["Fechalimite"];
            $eventos[$key]["url"] = $evento["Url"];
            $eventos[$key]["ubicacion"] = $evento["Ubicacion"];


            $eventos[$key]["id"] = ($eventos[$key]["id"] !== "") ? $eventos[$key]["id"] : "No Especificado";
            $eventos[$key]["imagen"] = ($eventos[$key]["imagen"] !== "") ? $eventos[$key]["imagen"] : "No Especificado";
            $eventos[$key]["nombre"] = ($eventos[$key]["nombre"] !== "") ? $eventos[$key]["nombre"] : "No Especificado";
            $eventos[$key]["tasa"] = ($eventos[$key]["tasa"] !== "") ? $eventos[$key]["tasa"] : "No Especificado";
            $eventos[$key]["fuente"] = ($eventos[$key]["fuente"] !== "") ? $eventos[$key]["fuente"] : "No Especificado";
            $eventos[$key]["facebook"] = ($eventos[$key]["facebook"] !== "") ? $eventos[$key]["facebook"] : "No Especificado";
            $eventos[$key]["fechaLimite"] = ($eventos[$key]["fechaLimite"] !== "") ? $eventos[$key]["fechaLimite"] : "No Especificado";
            $eventos[$key]["url"] = ($eventos[$key]["url"] !== "") ? $eventos[$key]["url"] : "No Especificado";
            $eventos[$key]["ubicacion"] = ($eventos[$key]["ubicacion"] !== "") ? $eventos[$key]["ubicacion"] : "No Especificado";

            $headers = get_headers($url, 1);
            if (isset($headers['X-WP-TotalPages'])) {
                $totalPages = (int) $headers['X-WP-TotalPages'];

            } else {
                $totalPages = 'El encabezado X-WP-TotalPages no está presente en la respuesta.';
            }
        }
        Cache::forget('procesing');
        return ['eventos' => $eventos, 'totalPages' => $totalPages];
        // Puedes manipular los datos según tus necesidades

    }
}
