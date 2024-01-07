<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use misFunciones;
use Symfony\Component\DomCrawler\Crawler;

require_once '../resources/views/fv/funciones.php';
use Symfony\Component\HttpClient\HttpClient;

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

        Cache::put('procesing', 'iniciando', 20);
        // Establecer el indicador de bloqueo
        sleep(2);
        Cache::put('procesing', 'iniciando2', 20);

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
                $htmlContent = $response->getContent();
                $crawler = new Crawler($htmlContent);
                $festivals = $crawler->filter('#card_contents .card-container');

                foreach ($festivals as $festival) {
                    $festivalCrawler = new Crawler($festival);
                    $title = $festivalCrawler->filter('.festival-card-title')->count() ? $festivalCrawler->filter('.festival-card-title')->text() : 'No Especificado';
                    $country = $festivalCrawler->filter('.festival-card-country')->count() ? $festivalCrawler->filter('.festival-card-country')->text() : 'No Especificado';
                    $durations = [];
                    $festivalCrawler->filter('.festival-card-type-holder .festival-card-type')->each(function ($durationNode) use (&$durations) {
                        $durations[] = $durationNode->text();
                    });
                    $imageFront = ($festivalCrawler->filter('.festival-card.card-front')->count()) ?
                    $this->extractImageUrl($festivalCrawler->filter('.festival-card.card-front')->attr('style')) : "No Especificado";
                    if ($imageFront === 'No Especificado') {
                        $imageFront = $festivalCrawler->filter('.festival-card-logo_new')->count() ?
                        $festivalCrawler->filter('.festival-card-logo_new')->attr('src') : 'No Especificado';
                    }
                    $imageBanner = $festivalCrawler->filter('.festival-card-banner')->count() ?
                    $this->extractImageUrl($festivalCrawler->filter('.festival-card-banner')->attr('style')) : 'No Especificado';

                    $redirectUrl = $festivalCrawler->filter('.festival-card-outer div:last-child a')->count()
                    ? 'https://filmmakers.festhome.com/festival/' . $festivalCrawler->filter('.festival-card-outer div:last-child a')->attr('data-full_url')
                    : 'No Especificado';

                    $tipoFestival = 'no especificado';
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
                    $deadline = [];
                    $deadline[0] = false;
                    $deadline[1] = $festivalCrawler->filter('.festival-card-status.days .date')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.festival-card-status.days .date')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'ubicacion' => $country,
                        'tipoMetraje' => $durations,
                        'tipoFestival' => $tipoFestival,
                        'imagen' => $imageFront,
                        'banner' => $imageBanner,
                        'url' => $redirectUrl,
                        'tasa' => $fees,
                        'fechaLimite' => $deadline,
                        'fuente' => 'FestHome',
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
                $response = $client->request('GET', 'https://festival.movibeta.com/festivals?page=' . $pages);
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
                        'fuente' => 'Movibeta',
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
                $response = $client->request('GET', 'https://www.animation-festivals.com/festivals-list/page/' . $pages);
                $htmlContent = $response->getContent();
                $crawler = new Crawler($htmlContent);

                $festivals = $crawler->filter('#festival-list li');
                foreach ($festivals as $festival) {
                    $festivalCrawler = new Crawler($festival);
                    $title = $festivalCrawler->filter('h2 a')->count() ? $festivalCrawler->filter('h2 a')->text() : 'No Especificado';
                    $country = $festivalCrawler->filter('.country')->count() ? $festivalCrawler->filter('.country')->text() : 'No Especificado';
                    $durations = ['No Especificado'];
                    // $festivalCrawler->filter('.festival-card-type-holder .festival-card-type')->each(function ($durationNode) use (&$durations) {
                    //     $durations[] = $durationNode->text();
                    // });
                    $imageFront = ($festivalCrawler->filter('.boxShadowForMobile a img')->count()) ?
                    $this->extractImageUrl($festivalCrawler->filter('.boxShadowForMobile a img')->attr('src')) : "No Especificado";
                    if ($imageFront === 'No Especificado') {
                        $imageFront = $festivalCrawler->filter('.festival-card-logo_new')->count() ?
                        $festivalCrawler->filter('.festival-card-logo_new')->attr('src') : 'No Especificado';
                    }
                    $imageBanner = 'No Especificado';

                    $redirectUrl = $festivalCrawler->filter('.links-info>a')->count()
                    ? $festivalCrawler->filter('.links-info>a')->attr('href')
                    : 'No Especificado';

                    $feesAux = $festivalCrawler->filter('.cost')->count()
                    ? $festivalCrawler->filter('.cost')->text('')
                    : 'No Especificado';
                    $fees = [$feesAux];

                    // Si no hay tasas, establece '0'
                    $fees = empty($fees) ? '0' : $fees;
                    $deadline = [];
                    $deadline[0] = false;
                    $deadline[1] = $festivalCrawler->filter('.submit-info .dates span')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.submit-info .dates span')->text(), 4) : 'No Especificado';
                    $data[] = [
                        'nombre' => $title,
                        'ubicacion' => $country,
                        'tipoMetraje' => $durations,
                        'tipoFestival' => $tipoFestival,
                        'imagen' => $imageFront,
                        'banner' => $imageBanner,
                        'url' => $redirectUrl,
                        'tasa' => $fees,
                        'fechaLimite' => $deadline,
                        'fuente' => 'animation-festivals',
                        // Añade más campos según sea necesario
                    ];
                }
                $dataTotal = $dataTotal + $data;
                break;
            case 'filmfreeaway':
                $client = HttpClient::create([
                    'verify_peer' => false,
                    'cafile' => 'C:/laragon/etc/ssl/cacert.pem', // Ajusta la ruta según tu configuración
                ]);
                $url = 'https://filmfreeway.com/festivals?page=' . $pages . '&per_page=50&sort=all_deadlines';
                $response = $client->request('GET', $url);
                $htmlContent = $response->getContent();
                $crawler = new Crawler($htmlContent);
                $festivals = $crawler->filter('.BrowseFestivalsCard');

                foreach ($festivals as $festival) {
                    $festivalCrawler = new Crawler($festival);
                    $title = $festivalCrawler->filter('.BrowseFestivalsCard-name')->count() ? $festivalCrawler->filter('.BrowseFestivalsCard-name')->text() : 'No Especificado';
                    $country = $festivalCrawler->filter('.BrowseFestivalsCard-meta span:nth-child(1)')->count() ? $festivalCrawler->filter('.BrowseFestivalsCard-meta span:nth-child(1)')->text() : 'No Especificado';
                    $country = $festivalCrawler->filter('.BrowseFestivalsCard-meta span:nth-child(1)')->count() ? $festivalCrawler->filter('.BrowseFestivalsCard-meta span:nth-child(1)')->text() : 'No Especificado';
                    $durations = [];
                    $durations[0] = 'No Especificado';
                    $imageFront = ($festivalCrawler->filter('.BrowseFestivalsCard-logo img')->count()) ?
                    $this->extractImageUrl($festivalCrawler->filter('.BrowseFestivalsCard-logo img')->attr('src')) : "No Especificado";

                    $imageBanner = 'No Especificado';
                    $redirectUrl = $festivalCrawler->filter('.BrowseFestivalsCard-buttons a:nth-child(1)')->count()
                    ? 'https://filmfreeway.com' . $festivalCrawler->filter('.BrowseFestivalsCard-buttons a:nth-child(1)')->attr('href')
                    : 'No Especificado';

                    $tipoFestival = 'No especificado';
                    $fees = 'No Especificado';
                    // Si no hay tasas, establece '0'
                    $fees = empty($fees) ? '0' : $fees;
                    // Agrega la fecha límite
                    $deadline = [];
                    $deadline[0] = false;
                    $deadline[1] = $festivalCrawler->filter('.festival-upcoming-deadline')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.festival-upcoming-deadline')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'ubicacion' => $country,
                        'tipoMetraje' => $durations,
                        'tipoFestival' => $tipoFestival,
                        'imagen' => $imageFront,
                        'banner' => $imageBanner,
                        'url' => $redirectUrl,
                        'tasa' => $fees,
                        'fechaLimite' => $deadline,
                        'fuente' => 'filmfreeaway',
                        // Añade más campos según sea necesario
                    ];
                }
                $dataTotal = $dataTotal + $data;

                break;
            case 'shortfilmdepot':
                $client = HttpClient::create([
                    'verify_peer' => false,
                    'cafile' => 'C:/laragon/etc/ssl/cacert.pem', // Ajusta la ruta según tu configuración
                ]);
                $url = 'https://www.shortfilmdepot.com';
                $response = $client->request('GET', $url);
                $htmlContent = $response->getContent();
                $crawler = new Crawler($htmlContent);
                $festivals = $crawler->filter('.onglet_home>a');

                foreach ($festivals as $festival) {
                    $festivalCrawler = new Crawler($festival);
                    $title = $festivalCrawler->filter('.h2_tcompet')->count() ? $festivalCrawler->filter('.h2_tcompet')->text() : 'No Especificado';
                    $country = $festivalCrawler->filter('.h1_text')->count() ? $festivalCrawler->filter('.h1_text')->text() : 'No Especificado';

                    $durations = [];
                    $durations[0] = 'No Especificado';
                    $imageFront = $festivalCrawler->filter('.fest2:nth-child(1) table tr td:nth-child(1)>img')->attr('src');
                    $imageFront = ($festivalCrawler->filter('.fest2:nth-child(1) table tr td:nth-child(1)>img')->count()) ?
                    $this->extractImageUrl($url . $festivalCrawler->filter('.fest2:nth-child(1) table tr td:nth-child(1)>img')->attr('src')) : "No Especificado";

                    $imageBanner = 'No Especificado';
                    $redirectUrl = $url . $festivalCrawler->attr('href');

                    $tipoFestival = 'No especificado';
                    $fees = $festivalCrawler->filter('.fest2:nth-child(1) table tr td:nth-child(2) .h2_text img[src="/img/pict_fee.png"]')->count();
                    // Si no hay tasas, establece '0'
                    $fees = $fees === 0 ? '0' : 'Tiene Tasas';
                    // Agrega la fecha límite
                    $deadline = [];
                    $deadline[0] = true;

                    $deadline[1] = $festivalCrawler->filter('.fest2:nth-child(1) table tr>td:nth-child(2)>h2 strong:nth-child(3) span')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.fest2:nth-child(1) table tr>td:nth-child(2)>h2 strong:nth-child(3) span')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'ubicacion' => $country,
                        'tipoMetraje' => $durations,
                        'tipoFestival' => $tipoFestival,
                        'imagen' => $imageFront,
                        'banner' => $imageBanner,
                        'url' => $redirectUrl,
                        'tasa' => $fees,
                        'fechaLimite' => $deadline,
                        'fuente' => 'shortfilmdepot',
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
        Cache::put('procesing', true, 0.0333);
        return response()->json(['status' => true, 'eventos' => $dataTotal]);
    }

    public function getEventos(Request $request)
    {
        Cache::put('procesing', 'iniciando', 20);
        // Establecer el indicador de bloqueo

        $apiUrl = env('APP_URL_WP') . '/wp-json/wp/v2/eventos';
        $page = $request->input('page');
        $orderby = $request->input('orderby');
        $per_page = $request->input('per_page');
        $order = $request->input('order');
        $dateStart = $request->input('dateStart');
        $dateEnd = $request->input('dateEnd');
        $fee = json_decode($request->input('fee'));
        $source = json_decode($request->input('source'));
        $params = [
            '_fields' => 'id,
            acm_fields.tasa,
            acm_fields.url,
            acm_fields.fuente,
            acm_fields.facebook,
            acm_fields.correoElectronico,
            acm_fields.nombre,
            acm_fields.fechaInicio,
            acm_fields.fechaLimite,
            acm_fields.ubicacion,
            acm_fields.imagen.media_details.sizes.full.source_url,
            acm_fields.tipoMetraje,
            acm_fields.tipoFestival,
            acm_fields.categoria,
            acm_fields.banner.media_details.full.source_url,
            acm_fields.web,
            acm_fields.instagram,
            acm_fields.youtube,
            acm_fields.industrias,
            acm_fields.telefono,
            acm_fields.twitterX,
            acm_fields.descripcion',
            // 'page' => $page,
            // 'per_page' => $per_page,
            // 'orderby' => $orderby,
            // 'order' => $order,
        ];

        // Construir la URL con los parámetros
        $url = $apiUrl . '?' . http_build_query($params);
        $eventos = [];
        if (Cache::has('eventos')) {
            Cache::put('procesing', 'Obteniendo Datos Local', 20);
            $eventos = Cache::get('eventos');

            Cache::put('eventos', $eventos, 3);

        } else {
            Cache::put('procesing', 'Obteniendo Datos De WordPress', 20);
            $response = Http::withOptions(['verify' => false])
                ->get($url);

            // Obtener el contenido de la respuesta en formato JSON
            $data = $response->json();

            foreach ($data as $key => $evento) {
                $eventos[$key] = [];
                $eventos[$key]["id"] = $evento["id"];
                $eventos[$key]["tasa"] = isset($evento["acm_fields"]["tasa"]) ? $evento["acm_fields"]["tasa"] : "No especificado";
                $eventos[$key]["fuente"] = isset($evento["acm_fields"]["fuente"]) ? $evento["acm_fields"]["fuente"] : "No especificado";
                $eventos[$key]["nombre"] = isset($evento["acm_fields"]["nombre"]) ? $evento["acm_fields"]["nombre"] : "No especificado";
                $eventos[$key]["url"] = isset($evento["acm_fields"]["url"]) ? $evento["acm_fields"]["url"] : "No especificado";
                $eventos[$key]["ubicacion"] = isset($evento["acm_fields"]["ubicacion"]) ? $evento["acm_fields"]["ubicacion"] : "No especificado";
                $eventos[$key]["fechaLimite"] = isset($evento["acm_fields"]["fechaLimite"]) ? $evento["acm_fields"]["fechaLimite"] : "No especificado";
                $eventos[$key]["imagen"] = isset($evento["acm_fields"]["imagen"]["media_details"]["sizes"]["full"]["source_url"]) ? $evento["acm_fields"]["imagen"]["media_details"]["sizes"]["full"]["source_url"] : "No especificado";
                $eventos[$key]["tipoMetraje"] = isset($evento["acm_fields"]["tipoMetraje"]) ? $evento["acm_fields"]["tipoMetraje"] : "No especificado";
                $eventos[$key]["tipoFestival"] = isset($evento["acm_fields"]["tipoFestival"]) ? $evento["acm_fields"]["tipoFestival"] : "No especificado";
                $eventos[$key]["categoria"] = isset($evento["acm_fields"]["categoria"]) ? $evento["acm_fields"]["categoria"] : "No especificado";
                $eventos[$key]["telefono"] = isset($evento["acm_fields"]["telefono"]) ? $evento["acm_fields"]["telefono"] : "No especificado";
                $eventos[$key]["fechaInicio"] = isset($evento["acm_fields"]["fechaInicio"]) ? $evento["acm_fields"]["fechaInicio"] : "No especificado";
                $eventos[$key]["facebook"] = isset($evento["acm_fields"]["facebook"]) ? $evento["acm_fields"]["facebook"] : "No especificado";
                $eventos[$key]["correoElectronico"] = isset($evento["acm_fields"]["correoElectronico"]) ? $evento["acm_fields"]["correoElectronico"] : "No especificado";
                $eventos[$key]["web"] = isset($evento["acm_fields"]["web"]) ? $evento["acm_fields"]["web"] : "No especificado";
                $eventos[$key]["instagram"] = isset($evento["acm_fields"]["instagram"]) ? $evento["acm_fields"]["instagram"] : "No especificado";
                $eventos[$key]["youtube"] = isset($evento["acm_fields"]["youtube"]) ? $evento["acm_fields"]["youtube"] : "No especificado";
                $eventos[$key]["industrias"] = isset($evento["acm_fields"]["industrias"]) ? $evento["acm_fields"]["industrias"] : "No especificado";
                $eventos[$key]["banner"] = isset($evento["acm_fields"]["banner"]["media_details"]["full"]["source_url"]) ? $evento["acm_fields"]["banner"]["media_details"]["full"]["source_url"] : "No especificado";
                $eventos[$key]["twitterX"] = isset($evento["acm_fields"]["twitterX"]) ? $evento["acm_fields"]["twitterX"] : "No especificado";
                $eventos[$key]["descripcion"] = isset($evento["acm_fields"]["descripcion"]) ? $evento["acm_fields"]["descripcion"] : "No especificado";

                $eventos[$key]["tasa"] = ($eventos[$key]["tasa"] !== "") ? $eventos[$key]["tasa"] : "No Especificado";
                $eventos[$key]["fuente"] = ($eventos[$key]["fuente"] !== "") ? $eventos[$key]["fuente"] : "No Especificado";
                $eventos[$key]["nombre"] = ($eventos[$key]["nombre"] !== "") ? $eventos[$key]["nombre"] : "No Especificado";
                $eventos[$key]["url"] = ($eventos[$key]["url"] !== "") ? $eventos[$key]["url"] : "No Especificado";
                $eventos[$key]["ubicacion"] = ($eventos[$key]["ubicacion"] !== "") ? $eventos[$key]["ubicacion"] : "No Especificado";
                $eventos[$key]["fechaLimite"] = ($eventos[$key]["fechaLimite"] !== "") ? $eventos[$key]["fechaLimite"] : "No Especificado";
                $eventos[$key]["imagen"] = ($eventos[$key]["imagen"] !== "") ? $eventos[$key]["imagen"] : "No Especificado";
                $eventos[$key]["tipoMetraje"] = ($eventos[$key]["tipoMetraje"] !== "") ? $eventos[$key]["tipoMetraje"] : "No Especificado";
                $eventos[$key]["tipoFestival"] = ($eventos[$key]["tipoFestival"] !== "") ? $eventos[$key]["tipoFestival"] : "No Especificado";
                $eventos[$key]["categoria"] = ($eventos[$key]["categoria"] !== "") ? $eventos[$key]["categoria"] : "No Especificado";
                $eventos[$key]["telefono"] = ($eventos[$key]["telefono"] !== "") ? $eventos[$key]["telefono"] : "No Especificado";
                $eventos[$key]["facebook"] = ($eventos[$key]["facebook"] !== "") ? $eventos[$key]["facebook"] : "No Especificado";
                $eventos[$key]["fechaInicio"] = ($eventos[$key]["fechaInicio"] !== "") ? $eventos[$key]["fechaInicio"] : "No Especificado";
                $eventos[$key]["correoElectronico"] = ($eventos[$key]["correoElectronico"] !== "") ? $eventos[$key]["correoElectronico"] : "No Especificado";
                $eventos[$key]["web"] = ($eventos[$key]["web"] !== "") ? $eventos[$key]["web"] : "No Especificado";
                $eventos[$key]["instagram"] = ($eventos[$key]["instagram"] !== "") ? $eventos[$key]["instagram"] : "No Especificado";
                $eventos[$key]["youtube"] = ($eventos[$key]["youtube"] !== "") ? $eventos[$key]["youtube"] : "No Especificado";
                $eventos[$key]["industrias"] = ($eventos[$key]["industrias"] !== "") ? $eventos[$key]["industrias"] : "No Especificado";
                $eventos[$key]["banner"] = ($eventos[$key]["banner"] !== "") ? $eventos[$key]["banner"] : "No Especificado";
                $eventos[$key]["twitterX"] = ($eventos[$key]["twitterX"] !== "") ? $eventos[$key]["twitterX"] : "No Especificado";
                $eventos[$key]["descripcion"] = ($eventos[$key]["descripcion"] !== "") ? $eventos[$key]["descripcion"] : "No Especificado";
                // $headers = get_headers($url, 1);
                // if (isset($headers['X-WP-TotalPages'])) {
                //     $totalPages = (int) $headers['X-WP-TotalPages'];

                // } else {
                //     $totalPages = 'El encabezado X-WP-TotalPages no está presente en la respuesta.';
                // }
            }
            Cache::put('eventos', $eventos, 3);
        }
        Cache::put('procesing', 'Organizando Datos', 20);
        $eventos=misFunciones::filtrarEventosConFiltros($eventos,$dateStart,$dateEnd,$fee,$source);
        $eventos = misFunciones::paginacion($eventos, $page, $per_page, $order, $orderby);
        Cache::put('procesing', true, 3);
        return $eventos;
        // Puedes manipular los datos según tus necesidades

    }
    public function getEventosJ(Request $request)
    {
        Cache::put('procesing', 'iniciando', 20);
        Cache::put('procesing', 'iniciando2', 20);

        $page = $request->input('page', 1);
        $per_page = $request->input('per_page', 5);

        $jsonFilePath = public_path('../src/assets/eventosP.json');

        // Verificar si el archivo existe antes de intentar leerlo
        if (file_exists($jsonFilePath)) {
            $jsonContent = file_get_contents($jsonFilePath);
            $data = json_decode($jsonContent, true); // true para obtener un array asociativo

            // Filtrar los eventos según la paginación
            $startIndex = ($page - 1) * $per_page;
            $eventos = array_slice($data['data'], $startIndex, $per_page);

            // Calcular el total de páginas
            $totalPages = ceil(count($data['data']) / $per_page);

            // Puedes manipular los datos según tus necesidades
            foreach ($eventos as $key => &$evento) {
                // ... (tu lógica actual)
                $evento["fuente"] = 'JSON LOCAL';
            }

            Cache::put('procesing', true, 0.0333);
            return ['status' => true, 'eventos' => $eventos, 'totalPages' => $totalPages];
        }
    }

}