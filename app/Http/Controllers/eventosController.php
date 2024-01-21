<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
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
    public function dropEvents(Request $request)
    {
        Cache::put('procesing', 'iniciando', 50);
        $page = $request->input('eventos');
        $token = 'Bearer ' . session('token');

        $response = Http::withOptions([
            'headers' => [
                'Authorization' => $token,
            ],
            'verify' => false])
            ->post($url);
    }
    public function saveImgs(Request $request)
    {
        Cache::put('procesing', 'Guardando Imagenes En Wordpress', 50);

        $apiUrl = config('app.urlWp') . '/wp-json/wp/v2/media';
        $imagenes = $request->input('imgs');
        $token = 'Bearer ' . session('token');

        // Crear un cliente Guzzle
        $client = new Client();

        // Array para almacenar los IDs de las imágenes guardadas
        $imageIds = [];

        foreach ($imagenes as $i => $imagenUrl) {
            try {
                Cache::put('procesing', 'Guardando Imagenen N°:' . $i . ' En Wordpress', 50);

                // Preparar las opciones de la solicitud para cada imagen
                $extension = pathinfo($imagenUrl, PATHINFO_EXTENSION);

                // Eliminar datos adicionales después de la extensión (por ejemplo, .jpgdatosramdom)
                $extension = preg_replace('/[^a-zA-Z]/', '', $extension);

                // Usar solo las extensiones .jpg o .png
                $extensionPermitida = in_array($extension, ['jpg', 'png', 'jpeg']) ? $extension : 'jpg';
                $identificadorUnico = uniqid();
                $imagenUrl = misFunciones::limpiarURL($imagenUrl);
                $options = [
                    'http' => [
                        'header' => "User-Agent: Mozilla/5.0\r\n" .
                        "Referer: http://www.example.com\r\n",
                    ],
                ];

                $context = stream_context_create($options);
                $dataImg = file_get_contents($imagenUrl, false, $context);

                $options = [
                    'headers' => [
                        'Authorization' => $token,
                    ],
                    'verify' => false,
                    'multipart' => [
                        [
                            'name' => 'file',
                            'contents' => $dataImg,
                            'filename' => $identificadorUnico . '.' . $extensionPermitida,
                        ],
                    ],
                ];

                // Realizar la solicitud POST con el cuerpo multipart
                $response = $client->post($apiUrl, $options);

                // Decodificar la respuesta JSON para obtener el ID de la imagen
                $responseData = json_decode($response->getBody()->getContents(), true);

                // Almacenar el ID de la imagen en el array
                $imageIds[] = isset($responseData['id']) ? $responseData['id'] : 0;

            } catch (Exception $e) {
                throw new Exception($e, 1);

                $imageIds[] = 0;
            }
        }

        // Devolver el array de IDs de imágenes
        return $imageIds;
    }

    public function eliminarDuplicados($array1, $array2)
    {
        Cache::put('procesing', 'Eliminando Datos Duplicados', 50);

        // Función para comparar elementos sin otras propiedades
        $compararElementos = function ($obj) {
            return [
                'nombre' => $obj["nombre"],
                'fuente' => $obj["fuente"],
                'ubicacion' => $obj["ubicacion"],
                'fechaLimite' => $obj["fechaLimite"],
            ];
        };

        // Convertir los arrays a arrays asociativos para facilitar la comparación
        $indexedArray1 = array_map($compararElementos, $array1);
        $indexedArray2 = array_map($compararElementos, $array2);

        // Filtrar los elementos de $indexedArray2 que no están en $indexedArray1
        $filteredArray2 = array_filter($indexedArray2, function ($item2) use ($indexedArray1) {
            return !in_array($item2, $indexedArray1);
        });

        // Obtener los índices de los elementos filtrados en $indexedArray2
        $filteredIndexes = array_keys($filteredArray2);
        $filteredUnique = array_unique($filteredIndexes, SORT_REGULAR);
        // Obtener los elementos correspondientes en el array original
        $resultArray2 = array_intersect_key($array2, array_flip($filteredUnique));

        // Reorganizar los índices para ocupar espacios vacíos
        $resultArray2 = array_values($resultArray2);

        return $resultArray2;
    }

    public function saveEvents(Request $request, $all = false)
    {
        Cache::put('procesing', 'Preparando Guardar Eventos', 50);

        if ($all) {
            if (Cache::has('eventosG')) {
                $eventos = Cache::get('eventosG');
            } else {
                Cache::put('procesing', true, 3);
                return response()->json('No hay Eventos En Cache');
            }

        } else {
            $eventos = json_decode($request->input('eventos'), true);

        }
        $eventosWP = $this->getEventos($request, true);

        $apiUrl = config('app.urlWp') . '/wp-json/wp/v2/eventos';
        $imgs = [];

        foreach ($eventos as $key => $evento) {
            if (!$all) {
                $eventos[$key]["fechaLimite"] = misFunciones::arrayToString($evento["fechaLimite"]["fecha"]);
                $evento["tasa"] = $evento["tasa"]["text"];
            }

            $eventos[$key]["fuente"] = misFunciones::arrayToString($evento["fuente"]);
            $eventos[$key]["categoria"] = misFunciones::arrayToString(isset($evento["categoria"]) ? 'No Especificado' : $evento["categoria"]);
            $eventos[$key]["tipoMetraje"] = misFunciones::arrayToString(isset($evento["tipoMetraje"]) ? 'No Especificado' : $evento["tipoMetraje"]);

        }
        $eventos = $this->eliminarDuplicados($eventosWP, $eventos);

        foreach ($eventos as $key => $evento) {
            array_push($imgs, $evento["imagen"]);
        }

        $request->merge(['imgs' => $imgs]);

        $imgs = $this->saveImgs($request);
        foreach ($eventos as $key => $evento) {
            $eventos[$key]["imagen"] = $imgs[$key];
        }

        foreach ($eventos as $key => $evento) {
            Cache::put('procesing', 'Guardando Evento N°:' . $key + 1, 50);

            $nombre = $evento["nombre"];
            $imagen = $evento["imagen"];
            $tasa = $evento["tasa"];
            $fechaLimite = $evento["fechaLimite"];
            $url = $evento["url"];
            $fuente = $evento["fuente"];
            $ubicacion = $evento["ubicacion"];
            $categoria = $evento["categoria"];
            $tipoFestival = $evento["tipoFestival"];
            $tipoMetraje = $evento["tipoMetraje"];

            $params = [
                "acf" => [
                    "nombre" => $nombre,
                    "imagen" => $imagen,
                    "tasa" => $tasa,
                    "fechaLimite" => $fechaLimite,
                    "url" => $url,
                    "fuente" => $fuente,
                    "ubicacion" => $ubicacion,
                    "categoria" => $categoria,
                    "tipoMetraje" => $tipoFestival,
                    "tipoFestival" => $tipoMetraje,
                ],
                "status" => "publish",
            ];

            $url = $apiUrl . '?' . http_build_query($params);
            $eventos = $request->input('eventos');
            $token = 'Bearer ' . session('token');

            $response = Http::withOptions([

                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => $token,
                ],
                'verify' => false])
                ->post($url);
        }

        Cache::put('procesing', true, 3);

        Cache::forget('eventosG');
        Cache::forget('eventos');
        return response()->json('se añadieron los eventos correctamente');
    }
    public function saveEventsAll(Request $request)
    {
        return $this->saveEvents($request, true);
    }
    public function extractFestivalDataGroup(Request $request)
    {
        Cache::put('procesing', 'Preparando Extraccion De Eventos', 50);
        $page = $request->input('page');
        $orderby = $request->input('orderby');
        $per_page = $request->input('per_page');
        $order = $request->input('order');
        $dateStart = $request->input('dateStart');
        $dateEnd = $request->input('dateEnd');
        $onlyFilter = $request->has('onlyFilter') ? $request->input('onlyFilter') : false;
        $fee = json_decode($request->input('fee'));
        $source = json_decode($request->input('source'));

        $source = misFunciones::convertirArrayAsociativoALista($source);
        $pages = null !== $request->input('pages') ? json_decode($request->input('pages')) : 1;
        if ($pages > 3) {
            $pages = 3;
        }
        if ($onlyFilter === 'true' && Cache::has('eventosG')) {
            $eventos = Cache::get('eventosG');
        } else {
            $eventos = [];
            for ($pageI = 1; $pageI <= $pages; $pageI++) {
                foreach ($source as $key => $festivalPage) {
                    $request->merge(['festivalPage' => $festivalPage]);
                    $request->merge(['pages' => $pageI]);
                    $data = $this->extractFestivalData($request, true);
                    if (misFunciones::esArrayNoAsociativo($data)) {
                        $eventos = array_merge($eventos, $data);
                    }

                }
            }
        }
        Cache::put('eventosG', $eventos);
        Cache::put('procesing', 'Filtrando Eventos', 50);

        $eventos = misFunciones::filtrarEventosConFiltros($eventos, $dateStart, $dateEnd, $fee, $source);
        $eventos = misFunciones::paginacion($eventos, $page, $per_page, $order, $orderby);
        Cache::put('procesing', true, 3);

        return $eventos;
    }
    public function extractFestivalData(Request $request, $group = false)
    {

        $festivalPage = null !== $request->input('festivalPage') ? $request->input('festivalPage') : "No Especificado";
        $pages = null !== $request->input('pages') ? $request->input('pages') : "No Especificado";

        $dataTotal = [];
        $data = [];
        Cache::put('procesing', 'Extrayendo Eventos De:' . $festivalPage, 50);

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

                    $deadline = $festivalCrawler->filter('.festival-card-status.days .date')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.festival-card-status.days .date')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'categoria' => 'no Especificado',
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
                        'nombre' => $row->filter('td:nth-child(1) h6')->text(),
                        'ubicacion' => $row->filter('td:nth-child(4)')->text(),
                        'tipoMetraje' => 'No Especificado',
                        'tipoFestival' => 'No Especificado',
                        'imagen' => $row->filter('td:nth-child(1) img')->attr('src'),
                        'banner' => 'No Especificado',
                        'tasa' => (int) $row->filter('td:nth-child(4)')->text(),
                        'fechaLimite' => \DateTime::createFromFormat('d/m/Y', $row->filter('td:nth-child(6)')->text()),
                        'url' => $row->filter('td:nth-child(7) a')->attr('href'),
                        'fuente' => 'Movibeta',
                    ];

                    $festivals[] = $festival;
                });

                $dataTotal = $dataTotal + $festivals;

                break;
            case 'animationfestivals':
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

                    $deadline = $festivalCrawler->filter('.submit-info .dates span')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.submit-info .dates span')->text(), 4) : 'No Especificado';
                    $data[] = [
                        'nombre' => $title,
                        'categoria' => 'no Especificado',
                        'ubicacion' => $country,
                        'tipoMetraje' => $durations,
                        'tipoFestival' => 'No Especificado',
                        'imagen' => $imageFront,
                        'banner' => $imageBanner,
                        'url' => $redirectUrl,
                        'tasa' => $fees,
                        'fechaLimite' => $deadline,
                        'fuente' => 'animationfestivals',
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

                    $deadline = $festivalCrawler->filter('.festival-upcoming-deadline')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.festival-upcoming-deadline')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'categoria' => 'no Especificado',
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

                    $deadline = $festivalCrawler->filter('.fest2:nth-child(1) table tr>td:nth-child(2)>h2 strong:nth-child(3) span')->count() ? misFunciones::convertirFecha($festivalCrawler->filter('.fest2:nth-child(1) table tr>td:nth-child(2)>h2 strong:nth-child(3) span')->text(), 4) : 'No Especificado';
                    // Añade más campos según sea necesario
                    $data[] = [
                        'nombre' => $title,
                        'categoria' => 'no Especificado',
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
        Cache::put('procesing', true, 3);
        if ($group) {
            return $dataTotal;
        } else {
            return response()->json(['status' => true, 'eventos' => $dataTotal]);
        }

    }
    public function getEventos(Request $request, $saveMode = false)
    {
        Cache::put('procesing', 'Preparando Obtencion De Eventos', 50);
        // Establecer el indicador de bloqueo
        $apiUrl = config('app.urlWp') . '/wp-json/wp/v2/eventos';
        if (!$saveMode) {
            $page = $request->input('page');
            $orderby = $request->input('orderby');
            $per_page = $request->input('per_page');
            $order = $request->input('order');
            $dateStart = $request->input('dateStart');
            $dateEnd = $request->input('dateEnd');
            $fee = json_decode($request->input('fee'));
            $source = json_decode($request->input('source'));
            $source = misFunciones::convertirArrayAsociativoALista($source);
        }
        $onlyFilter = $request->input('onlyFilter') !== null;

        $params = [
            '_fields' => 'id,acf.tasa,acf.url,acf.fuente,acf.facebook,acf.correoElectronico,acf.nombre,acf.fechaInicio,acf.fechaLimite,acf.ubicacion,acf.imagen,acf.tipoMetraje,acf.tipoFestival,acf.categoria,acf.banner,acf.web,acf.instagram,acf.youtube,acf.industrias,acf.telefono,acf.twitterX,acf.descripcion',
            // 'page' => $page,
            'per_page' => 1000,
            // 'orderby' => $orderby,
            // 'order' => $order,
        ];

        // Construir la URL con los parámetros
        $url = $apiUrl . '?' . http_build_query($params);
        $eventos = [];
        if (Cache::has('eventos') && $onlyFilter) {
            Cache::put('procesing', 'Obteniendo Datos Local', 50);
            $eventos = Cache::get('eventos');
            Cache::put('eventos', $eventos);

        } else {
            Cache::put('procesing', 'Obteniendo Datos De WordPress', 50);
            $token = 'Bearer ' . session('token');

            $response = Http::withOptions([
                'headers' => [
                    'Authorization' => $token,
                ],
                'verify' => false])
                ->get($url);

            // Obtener el contenido de la respuesta en formato JSON
            $data = $response->json();

            foreach ($data as $key => $evento) {
                $eventos[$key] = [];
                $eventos[$key]["id"] = $evento["id"];
                $eventos[$key]["tasa"] = isset($evento["acf"]["tasa"]) ? $evento["acf"]["tasa"] : "No especificado";
                $eventos[$key]["fuente"] = isset($evento["acf"]["fuente"]) ? $evento["acf"]["fuente"] : "No especificado";
                $eventos[$key]["nombre"] = isset($evento["acf"]["nombre"]) ? $evento["acf"]["nombre"] : "No especificado";
                $eventos[$key]["url"] = isset($evento["acf"]["url"]) ? $evento["acf"]["url"] : "No especificado";
                $eventos[$key]["ubicacion"] = isset($evento["acf"]["ubicacion"]) ? $evento["acf"]["ubicacion"] : "No especificado";
                $eventos[$key]["fechaLimite"] = isset($evento["acf"]["fechaLimite"]) ? $evento["acf"]["fechaLimite"] : "No especificado";
                $eventos[$key]["imagen"] = isset($evento["acf"]["imagen"]) ? config('app.urlWp') . '/wp-json/custom/v1/image/' . $evento["acf"]["imagen"] : "No especificado";
                $eventos[$key]["tipoMetraje"] = isset($evento["acf"]["tipoMetraje"]) ? $evento["acf"]["tipoMetraje"] : "No especificado";
                $eventos[$key]["tipoFestival"] = isset($evento["acf"]["tipoFestival"]) ? $evento["acf"]["tipoFestival"] : "No especificado";
                $eventos[$key]["categoria"] = isset($evento["acf"]["categoria"]) ? $evento["acf"]["categoria"] : "No especificado";
                $eventos[$key]["telefono"] = isset($evento["acf"]["telefono"]) ? $evento["acf"]["telefono"] : "No especificado";
                $eventos[$key]["fechaInicio"] = isset($evento["acf"]["fechaInicio"]) ? $evento["acf"]["fechaInicio"] : "No especificado";
                $eventos[$key]["facebook"] = isset($evento["acf"]["facebook"]) ? $evento["acf"]["facebook"] : "No especificado";
                $eventos[$key]["correoElectronico"] = isset($evento["acf"]["correoElectronico"]) ? $evento["acf"]["correoElectronico"] : "No especificado";
                $eventos[$key]["web"] = isset($evento["acf"]["web"]) ? $evento["acf"]["web"] : "No especificado";
                $eventos[$key]["instagram"] = isset($evento["acf"]["instagram"]) ? $evento["acf"]["instagram"] : "No especificado";
                $eventos[$key]["youtube"] = isset($evento["acf"]["youtube"]) ? $evento["acf"]["youtube"] : "No especificado";
                $eventos[$key]["industrias"] = isset($evento["acf"]["industrias"]) ? $evento["acf"]["industrias"] : "No especificado";
                $eventos[$key]["banner"] = isset($evento["acf"]["banner"]["media_details"]["full"]["source_url"]) ? $evento["acf"]["banner"]["media_details"]["full"]["source_url"] : "No especificado";
                $eventos[$key]["twitterX"] = isset($evento["acf"]["twitterX"]) ? $evento["acf"]["twitterX"] : "No especificado";
                $eventos[$key]["descripcion"] = isset($evento["acf"]["descripcion"]) ? $evento["acf"]["descripcion"] : "No especificado";

                $eventos[$key]["nombre"] = ($eventos[$key]["nombre"] !== "") ? $eventos[$key]["nombre"] : "No Especificado";
                $eventos[$key]["ubicacion"] = ($eventos[$key]["ubicacion"] !== "") ? $eventos[$key]["ubicacion"] : "No Especificado";
                $eventos[$key]["tipoMetraje"] = ($eventos[$key]["tipoMetraje"] !== "") ? $eventos[$key]["tipoMetraje"] : "No Especificado";
                $eventos[$key]["imagen"] = ($eventos[$key]["imagen"] !== "") ? $eventos[$key]["imagen"] : "No Especificado";
                $eventos[$key]["banner"] = ($eventos[$key]["banner"] !== "") ? $eventos[$key]["banner"] : "No Especificado";
                $eventos[$key]["categoria"] = ($eventos[$key]["categoria"] !== "") ? $eventos[$key]["categoria"] : "No Especificado";
                $eventos[$key]["url"] = ($eventos[$key]["url"] !== "") ? $eventos[$key]["url"] : "No Especificado";
                $eventos[$key]["tasa"] = ($eventos[$key]["tasa"] !== "") ? $eventos[$key]["tasa"] : "No Especificado";
                $eventos[$key]["fechaLimite"] = ($eventos[$key]["fechaLimite"] !== "") ? $eventos[$key]["fechaLimite"] : "No Especificado";
                $eventos[$key]["fuente"] = ($eventos[$key]["fuente"] !== "") ? $eventos[$key]["fuente"] : "No Especificado";
                $eventos[$key]["tipoFestival"] = ($eventos[$key]["tipoFestival"] !== "") ? $eventos[$key]["tipoFestival"] : "No Especificado";
                $eventos[$key]["telefono"] = ($eventos[$key]["telefono"] !== "") ? $eventos[$key]["telefono"] : "No Especificado";
                $eventos[$key]["facebook"] = ($eventos[$key]["facebook"] !== "") ? $eventos[$key]["facebook"] : "No Especificado";
                $eventos[$key]["fechaInicio"] = ($eventos[$key]["fechaInicio"] !== "") ? $eventos[$key]["fechaInicio"] : "No Especificado";
                $eventos[$key]["correoElectronico"] = ($eventos[$key]["correoElectronico"] !== "") ? $eventos[$key]["correoElectronico"] : "No Especificado";
                $eventos[$key]["web"] = ($eventos[$key]["web"] !== "") ? $eventos[$key]["web"] : "No Especificado";
                $eventos[$key]["instagram"] = ($eventos[$key]["instagram"] !== "") ? $eventos[$key]["instagram"] : "No Especificado";
                $eventos[$key]["youtube"] = ($eventos[$key]["youtube"] !== "") ? $eventos[$key]["youtube"] : "No Especificado";
                $eventos[$key]["industrias"] = ($eventos[$key]["industrias"] !== "") ? $eventos[$key]["industrias"] : "No Especificado";
                $eventos[$key]["twitterX"] = ($eventos[$key]["twitterX"] !== "") ? $eventos[$key]["twitterX"] : "No Especificado";
                $eventos[$key]["descripcion"] = ($eventos[$key]["descripcion"] !== "") ? $eventos[$key]["descripcion"] : "No Especificado";
                // $headers = get_headers($url, 1);
                // if (isset($headers['X-WP-TotalPages'])) {
                //     $totalPages = (int) $headers['X-WP-TotalPages'];

                // } else {
                //     $totalPages = 'El encabezado X-WP-TotalPages no está presente en la respuesta.';
                // }
            }
            Cache::put('eventos', $eventos);
        }
        Cache::put('procesing', 'Organizando Datos', 50);
        if (!$saveMode) {
            $eventos = misFunciones::filtrarEventosConFiltros($eventos, $dateStart, $dateEnd, $fee, $source);
            $eventos = misFunciones::paginacion($eventos, $page, $per_page, $order, $orderby);
            Cache::put('procesing', true, 3);
        }
        return $eventos;
        // Puedes manipular los datos según tus necesidades
    }
    public function getEventosJ(Request $request)
    {
        Cache::put('procesing', 'iniciando', 50);
        Cache::put('procesing', 'iniciando2', 50);

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

            Cache::put('procesing', true, 3);
            return ['status' => true, 'eventos' => $eventos, 'totalPages' => $totalPages];
        }
    }

}