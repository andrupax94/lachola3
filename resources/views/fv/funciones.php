<?php

use App\Models\color;
use App\Models\diseno;
use App\Models\franela;
use App\Models\material;
use App\Models\modelo;
use App\Models\producto;
use App\Models\tipo;
use Barryvdh\Debugbar\Facades\Debugbar;

class misFunciones
{

    public static function esArrayNoAsociativo($array)
    {
        if (!is_array($array)) {
            return false;
        }

        $keys = array_keys($array);

        // Verifica si todas las claves son enteros y consecutivos comenzando desde 0
        return array_keys($keys) === $keys;
    }
    public static function convertirArrayAsociativoALista($arrayAsociativo)
    {
        if (is_array($arrayAsociativo)) {
            // No es un array asociativo, devolver el valor sin cambios
            return $arrayAsociativo;
        }

        $lista = [];
        foreach ($arrayAsociativo as $clave => $valor) {
            if ($valor) {
                $lista[] = $clave;
            }
        }
        return $lista;
    }
    public static function stringToArray($valor, $separator = ',')
    {
        $aux = null;

        if ($valor !== null && is_string($valor)) {
            $aux = explode($separator, $valor);

            if ($aux !== null) {
                if (is_string($aux)) {
                    $aux = [$aux];
                }
            }
        } else {
            $aux = $valor;
        }

        return $aux;
    }

    public static function filtrarEventosConFiltros($eventos, $fechaInicio, $fechaFin, $fee, $fuente)
    {
        // Filtrar por rango de fechas
        $fechaInicio = misFunciones::convertirFecha($fechaInicio, 5);
        $fechaFin = misFunciones::convertirFecha($fechaFin, 5);
        $eventosFiltrados = collect($eventos)->filter(function ($evento) use ($fechaInicio, $fechaFin) {
            if ($evento["fechaLimite"] === 'No Especificado') {
                $fechaLimite = '29991231';
            } else {
                $fechaLimite = misFunciones::convertirFecha($evento["fechaLimite"], 5);
            }

            return $fechaLimite >= $fechaInicio && $fechaLimite <= $fechaFin;
        })->values();

        // Filtrar por criterios sobre tasas
        $eventosFiltrados = collect($eventosFiltrados)->filter(function ($evento) use ($fee) {
            $aux = 0;
            $aux2 = misFunciones::stringToArray($evento["tasa"]);
            if (count($aux2) > 1) {
                $aux = 2;
            } else {
                if (!in_array('FREE', $aux2) && !in_array('free', $aux2) && !in_array('0', $aux2)) {
                    $aux = 0;
                } else {
                    $aux = 1;
                }

            }

            return ($fee[0] && $aux === 0) || ($fee[1] && $aux === 1) || ($fee[2] && $aux === 2);
        })->values();

        if (!empty($fuente)) {
            $eventosFiltrados = collect($eventosFiltrados)->filter(function ($evento) use ($fuente) {
                $fuenteEvento = strtolower(str_replace(' ', '', $evento["fuente"]));
                return collect($fuente)->contains(function ($filtro) use ($fuenteEvento) {
                    return strpos($fuenteEvento, strtolower(str_replace(' ', '', $filtro))) !== false;
                });
            })->values();
        }

        return $eventosFiltrados;
    }

    public static function paginacion($eventos, $page, $per_page, $order, $orderby)
    {

        // Aplicar ordenamiento
        $sortedEventos = ($order == 'asc') ?
        collect($eventos)->sortBy($orderby)->values() :
        collect($eventos)->sortByDesc($orderby)->values();

        // Calcular el índice de inicio y fin para la paginación

        // Calcular el índice de inicio y fin para la paginación
        $startIndex = ($page - 1) * $per_page;
        $slicedEventos = $sortedEventos->slice($startIndex, $per_page);
        $slicedEventos = $slicedEventos->values();

        // Calcular el número total de páginas
        $totalPages = ceil(count($sortedEventos) / $per_page);

        // Devolver los eventos filtrados, ordenados y la información de paginación
        return [
            'eventos' => $slicedEventos,
            'totalPages' => $totalPages,
            'status' => true,
        ];
    }

    public static function convertirFecha($fecha, $tipoConversion)
    {
        // Verificar si la entrada contiene "Today" o "Hoy"
        if (stripos($fecha, 'Today') !== false || stripos($fecha, 'Hoy') !== false) {
            // Obtener la fecha actual
            $fechaObj = new DateTime();
        } elseif (preg_match('/(?:Next|Final) Deadline: ([A-Za-z]+) (\d{1,2}), (\d{4})/', $fecha, $matches)) {
            // Manejar el formato "Next Deadline: December 27, 2023" o "Final Deadline: December 27, 2023"
            $month = $matches[1];
            $day = $matches[2];
            $year = $matches[3];
            $fechaObj = new DateTime("$month $day, $year");
        } else {
            // Convertir la fecha a un objeto DateTime
            $fechaObj = new DateTime($fecha);
        }

        // Definir los formatos de salida según el tipo de conversión
        $formatos = [
            1 => 'd/m/Y',
            2 => 'd-m-Y',
            3 => 'd-m-Y',
            4 => 'd-m-Y',
            5 => 'Ymd',
            // Agrega más formatos según tus necesidades
        ];

        // Verificar si el tipo de conversión existe en la lista
        if (array_key_exists($tipoConversion, $formatos)) {
            // Formatear la fecha según el tipo de conversión
            $fechaFormateada = $fechaObj->format($formatos[$tipoConversion]);
            // Reemplazar el marcador <mesEnPalabras> con el nombre del mes
            return $fechaFormateada;
        } else {
            // Tipo de conversión no válido
            return "Tipo de conversión no válido";
        }
    }

    private static function obtenerMesEnPalabras2($numeroMes)
    {
        // Definir un array asociativo con los nombres de los meses
        $mesesEnPalabras = [
            'ene' => '01',
            'feb' => '02',
            'mar' => '03',
            'abr' => '04',
            'may' => '05',
            'jun' => '06',
            'jul' => '07',
            'ago' => '08',
            'sep' => '09',
            'oct' => '10',
            'nov' => '11',
            'dic' => '12',
            'January' => '01',
            'February' => '02',
            'March' => '03',
            'April' => '04',
            'May' => '05',
            'June' => '06',
            'July' => '07',
            'August' => '08',
            'September' => '09',
            'October' => '10',
            'November' => '11',
            'December' => '12',
        ];

        // Obtener el número del mes a partir de su representación en palabras
        return $mesesEnPalabras[$numeroMes];
    }
    private static function obtenerMesEnPalabras($numeroMes)
    {
        // Definir un array asociativo con los nombres de los meses
        $mesesEnPalabras = [
            '01' => 'ene',
            '02' => 'feb',
            '03' => 'mar',
            '04' => 'abr',
            '05' => 'may',
            '06' => 'jun',
            '07' => 'jul',
            '08' => 'ago',
            '09' => 'sep',
            '10' => 'oct',
            '11' => 'nov',
            '12' => 'dic',
        ];

        // Obtener el nombre del mes a partir del número
        return $mesesEnPalabras[$numeroMes];
    }

    public static $aprobado = true;
    //desconocimiento de uso
    public static function getMime($image)
    {

        return $image->getClientOriginalExtension();
    }

    public static function getBase64($image)
    {

        $flujo = fopen($image->getRealPath(), 'r');
        $enbase64 = base64_encode(fread($flujo, filesize($image->getRealPath())));
        fclose($flujo);
        return $enbase64;
    }
    public static function imagen_width($valor, $width)
    {

        if (is_string($valor)) {

            $binary = base64_decode(explode(',', $valor)[1]);
            $valor = getimagesizefromstring($binary);
        } else {
            $valor = getimagesize($valor['tmp_name']);
        }
        $imagewidth = explode(',', $width);
        if ($valor[0] < $imagewidth[0] || $valor[0] > $imagewidth[1]) {
            misFunciones::$aprobado = false;
        }
    }
    public static function imagen_height($valor, $width)
    {

        if (is_string($valor)) {

            $binary = base64_decode(explode(',', $valor)[1]);
            $valor = getimagesizefromstring($binary);
        } else {
            $valor = getimagesize($valor['tmp_name']);
        }
        $imageheight = explode(',', $width);
        if ($valor[1] < $imageheight[0] || $valor[1] > $imageheight[1]) {
            misFunciones::$aprobado = false;
        }
    }

    public static function imagen_extencion($valor, $extenciones)
    {
        if (is_string($valor)) {
            if (misFunciones::vbase64($valor, true)) {
                $extencion = explode('/', mime_content_type($valor))[1];
            } else {
                $extencion = explode('.', $valor);
                $extencion = $extencion[count($extencion) - 1];
            }
        } else {
            $valor = $valor['name'];
            $extencion = explode('.', $valor);
        }
        Debugbar::info($extencion);
        $extencionescontador = 0;
        $extensiones = explode(',', $extenciones);

        for ($x = 0; $x < count($extensiones); $x++) {
            if ($extencion !== $extensiones[$x]) {
                $extencionescontador++;
            } else {
                $returname = $extensiones[$x];
            }
        }

        if ($extencionescontador === count($extensiones)) {
            misFunciones::$aprobado = false;
            $returname = false;
        }
        return $returname;
    }
    //desconocimiento parcial de uso
    public static function qualityBase64img($base64img, $mimeimg, $quality)
    {

        ob_start();
        $im = imagecreatefromstring(base64_decode($base64img));

        switch ($mimeimg) {
            case 'png':
            case 'image/png':
                imagepng($im, null, $quality);
                break;
            case 'jpg':
            case 'image/jpg':
            case 'jpeg':
            case 'image/jpeg':
                imagejpeg($im, null, $quality);
                break;
            case 'image/gif':
            case 'gif':
                imagegif($im, null, $quality);
        }

        $stream = ob_get_clean();
        $newB64 = base64_encode($stream);
        imagedestroy($im);
        return $newB64;
    }

    public static function resizeBase64img($base64img, $mimeimg, $newwidth, $newheight)
    {

        // Get new sizes
        list($width, $height) = getimagesizefromstring(base64_decode($base64img));

        ob_start();
        $temp_thumb = imagecreatetruecolor($newwidth, $newheight);
        imagealphablending($temp_thumb, false);
        imagesavealpha($temp_thumb, true);

        $source = imagecreatefromstring(base64_decode($base64img));

        // Resize
        imagecopyresized($temp_thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

        switch ($mimeimg) {
            case 'png':
            case 'image/png':
            case 'PNG':
            case 'IMAGE/PNG':
                imagepng($temp_thumb, null);
                break;
            case 'jpg':
            case 'image/jpg':
            case 'jpeg':
            case 'JPEG':
            case 'JPG':
            case 'IMAGE/JPG':
            case 'IMAGE/JPEG':
            case 'image/jpeg':
                imagejpeg($temp_thumb, null);
                break;
            case 'image/gif':
            case 'gif':
            case 'GIT':
            case 'IMAGE/GIF':
                imagegif($temp_thumb, null);
        }

        $stream = ob_get_clean();
        $newB64 = base64_encode($stream);
        imagedestroy($temp_thumb);
        imagedestroy($source);
        return $newB64;
    }

    public static function resizeBase64andScaleWidth($base64img, $mimeimg, $newheight)
    {

        // Get new sizes
        list($width, $height) = getimagesizefromstring(base64_decode($base64img));

        // Calcular nuevo ancho con la misma perdida o ganancia proporcial del alto (Escalar)
        $porNewHeight = ($newheight * 100) / $height;
        $newwidth = (int) ($width * ($porNewHeight / 100));

        ob_start();
        $temp_thumb = imagecreatetruecolor($newwidth, $newheight);
        imagealphablending($temp_thumb, false);
        imagesavealpha($temp_thumb, true);

        $source = imagecreatefromstring(base64_decode($base64img));

        // Resize
        imagecopyresized($temp_thumb, $source, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

        switch ($mimeimg) {
            case 'png':
            case 'image/png':
            case 'PNG':
            case 'IMAGE/PNG':
                imagepng($temp_thumb, null);
                break;
            case 'jpg':
            case 'image/jpg':
            case 'jpeg':
            case 'JPEG':
            case 'JPG':
            case 'IMAGE/JPG':
            case 'IMAGE/JPEG':
            case 'image/jpeg':
                imagejpeg($temp_thumb, null);
                break;
            case 'image/gif':
            case 'gif':
            case 'GIT':
            case 'IMAGE/GIF':
                imagegif($temp_thumb, null);
        }

        $stream = ob_get_clean();
        $newB64 = base64_encode($stream);

        imagedestroy($temp_thumb);
        imagedestroy($source);

        return $newB64;
    }

    public static function resizeBase64andScaleHeight($base64img, $mimeimg, $newwidth)
    {

        // Get new sizes
        list($width, $height) = getimagesizefromstring(base64_decode($base64img));

        // Calcular nuevo alto con la misma perdida o ganancia proporcial del ancho (Escalar)
        $porNewWidth = ($newwidth * 100) / $width;
        $newHeight = (int) ($height * ($porNewWidth / 100));

        ob_start();
        $temp_thumb = imagecreatetruecolor($newwidth, $newHeight);
        imagealphablending($temp_thumb, false);
        imagesavealpha($temp_thumb, true);

        $source = imagecreatefromstring(base64_decode($base64img));

        // Resize
        imagecopyresized($temp_thumb, $source, 0, 0, 0, 0, $newwidth, $newHeight, $width, $height);

        switch ($mimeimg) {
            case 'png':
            case 'image/png':
            case 'PNG':
            case 'IMAGE/PNG':
                imagepng($temp_thumb, null);
                break;
            case 'jpg':
            case 'image/jpg':
            case 'jpeg':
            case 'JPEG':
            case 'JPG':
            case 'IMAGE/JPG':
            case 'IMAGE/JPEG':
            case 'image/jpeg':
                imagejpeg($temp_thumb, null);
                break;
            case 'image/gif':
            case 'gif':
            case 'GIT':
            case 'IMAGE/GIF':
                imagegif($temp_thumb, null);
        }

        $stream = ob_get_clean();
        $newB64 = base64_encode($stream);

        imagedestroy($temp_thumb);
        imagedestroy($source);

        return $newB64;
    }

    //desconocimiento parcial de uso y sin uso
    /*public static function uploadInFolder($idResource, $file, $path_absolute_folder)
    {

    try {
    $date =  getdate();
    $mime = "." . $this->getMime($file);
    $filename = $idResource . "_" . $date["year"] . "_" . $date["mon"] . "_" . $date["mday"] . "-" .
    $date["hours"] . "-" . $date["minutes"] . "-" . $date["seconds"] . $mime;

    move_uploaded_file($file, $path_absolute_folder . $filename);
    return $filename;
    } catch (Exception $e) {
    return false;
    }
    }
     */

    public static function primary_id_producto(): int
    {
        try {
            $id_producto = producto::latest()->first()->id_producto;
            return $id_producto;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_color(): int
    {
        try {
            $id_color = color::latest()->first()->id_color;
            return $id_color;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_diseno(): int
    {
        try {
            $id_diseno = diseno::latest()->first()->id_diseno;
            return $id_diseno;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_material(): int
    {
        try {
            $id_material = material::latest()->first()->id_material;
            return $id_material;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_modelo(): int
    {
        try {
            $id_modelo = modelo::latest()->first()->id_modelo;
            return $id_modelo;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_franela(): int
    {
        try {
            $id_franela = franela::latest()->first()->id_franela;
            return $id_franela;
        } catch (exception $e) {
            return 0;
        }
    }
    public static function primary_id_tipo(): int
    {
        try {
            $id_tipo = tipo::latest()->first()->id_tipo;
            return $id_tipo;
        } catch (exception $e) {
            return 0;
        }
    }
    //aparentemente sin uso
    public static function getAprobado()
    {
        $aux = misFunciones::$aprobado;
        misFunciones::$aprobado = true;
        return $aux;
    }

    public static function log($e, $type)
    {
        $result = 'none';

        if ($type === 'PHP') {

            $linea = $e->getLine();
            $errorTitle = 'PHP:' . explode('(', $e->getMessage())[0];
            $archivoC = $e->getFile();
            $mensaje = $e->getMessage();
        } else {
            $linea = $e->linea;
            $errorTitle = $e->error;
            $archivoC = $e->archivo;
            $mensaje = $e->errorLong;
        }
        $log = new App\Models\log();
        $log->linea = $linea;
        $log->error = $errorTitle;
        $log->archivo = $archivoC;
        $log->save();
        $micarpeta = '../log';
        if (!file_exists($micarpeta)) {
            if (!mkdir($micarpeta, 0777, true)) {
                $result = 'Fallo al crear las carpetas...';
            }
        }
        $fecha = explode(" ", (string) $log->created_at);
        $micarpeta = '../log/' . $fecha[0];
        if (!file_exists($micarpeta)) {
            if (!mkdir($micarpeta, 0777, true)) {
                $result = 'Fallo al crear las carpetas...';
            }
        }
        $archivo = fopen("../log/" . $fecha[0] . '/log.txt', "a");
        fwrite($archivo, "\n-.-:v" . $log->id . "-.-:v----------------------INI(" . $fecha[1] . ")------------------------------------------------------------\n\n");
        fwrite($archivo, $mensaje . '');
        fwrite($archivo, "\n\n-.-:v" . $log->id . "-.-:v----------------------FIN(" . $fecha[1] . ")-----------------------------------------------------------\n\n");
        if ($archivo == false) {
            $result = "Error al crear el archivo";
        } else {
            $result = "El archivo ha sido creado";
        }

        fclose($archivo);
        return $result;
    }

    public static function getRealIP()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }

        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return $_SERVER['HTTP_X_FORWARDED_FOR'];
        }

        return $_SERVER['REMOTE_ADDR'];
    }
    public static function medida($valor, $medidaE)
    {
        if (count($medidaE) > 0 && $valor !== 'Sin Especificar') {
            $valor = explode('x', $valor);
            if (count($valor) !== count($medidaE) || $valor[count($valor) - 1] === '') {
                misFunciones::$aprobado = false;
            }
        }
    }
    public static function validarciudad($estado, $valor)
    {
        switch ($estado) {
            case "Amazonas":
                misFunciones::palabras_clave_unica($valor, 'Puerto Ayacucho');
                break;
            case "Anzoategui":
                misFunciones::palabras_clave_unica($valor, 'Anaco,Barcelona,Clarines,El Tigre,Guanta,Pariguan,Puerto La Cruz,Puerto Piritu');
                break;
            case "Apure":

                misFunciones::palabras_clave_unica($valor, 'Achaguas,Biruaca,Guasdualito,San Fernando De Apure');
                break;
            case "Aragua":

                misFunciones::palabras_clave_unica($valor, 'Cagua,La Victoria (aragua),Maracay,Palo Negro,Santa Cruz De Aragua,Santa Rita (aragua),Turmero,Villa De Cura');
                break;
            case "Barinas":

                misFunciones::palabras_clave_unica($valor, 'Barinas,Barinitas,Ciudad Bolivia,Sabaneta (barinas),Santa Barbara (barinas),Socopo');
                break;
            case "Bolivar":

                misFunciones::palabras_clave_unica($valor, 'Ciudad Bolivar,Puerto Ordaz,San Felix (bolivar),Upata');
                break;
            case "Cojedes":

                misFunciones::palabras_clave_unica($valor, 'San Carlos (cojedes),Tinaquillo');
                break;
            case "Carabobo":

                misFunciones::palabras_clave_unica($valor, 'Bejuma,Guacara,Guigue,Los Guayos,Mariara,Moron,Naguanagua,Puerto Cabello,San Joaquin (carabobo),Valencia');
                break;
            case "Delta Amacuro":

                misFunciones::palabras_clave_unica($valor, 'Tucupita');
                break;
            case "Distrito Capital":

                misFunciones::palabras_clave_unica($valor, 'Caraballeda Edo.vargas,Caracas,Catia La Mar Edo.vargas,El Junquito Dtto.capital,Maiquetia Edo.vargas');
                break;
            case "Falcon":

                misFunciones::palabras_clave_unica($valor, 'Carirubana,Chichiriviche,Coro,Dabajuro,La Vela De Coro,Puerto Cumarebo,Punto Fijo,Tucacas');
                break;
            case "Guarico":

                misFunciones::palabras_clave_unica($valor, 'Altagracia De Orituco,Calabozo,Camaguan,San Juan De Los Morros,Valle De La Pascua,Zaraza');
                break;
            case "Lara":

                misFunciones::palabras_clave_unica($valor, 'Barquisimeto,Cabudare,Carora,Duaca,El Tocuyo,Quibor');
                break;
            case "Merida":

                misFunciones::palabras_clave_unica($valor, 'Ejido,El Vigia,La Azulita,Lagunillas (merida),MeridaTovar (merida)');
                break;
            case "Miranda":

                misFunciones::palabras_clave_unica($valor, 'Carrizal,Caucagua,Charallave,CuaGuarenas,Guatire,Higuerote,Los Teques (miranda),Ocumare Del Tuy,Rio Chico,San Antonio De Los Altos,Santa Teresa Del Tuy');
                break;
            case "Monagas":

                misFunciones::palabras_clave_unica($valor, 'Caripe,Maturin,Punta De Mata,Temblador');
                break;
            case "Nueva Esparta":

                misFunciones::palabras_clave_unica($valor, 'El Valle Del Espiritu Santo.La Asuncion,Pampatar,Porlamar,San Juan Bautista');
                break;
            case "Portuguesa":

                misFunciones::palabras_clave_unica($valor, 'Acarigua,Araure,Biscucuy,Guanare,Guanarito,Turen');
                break;
            case "Sucre":

                misFunciones::palabras_clave_unica($valor, 'Cariaco,Carupano,Casanay,Cumana,Guiria');
                break;
            case "Tachira":

                misFunciones::palabras_clave_unica($valor, 'Capacho,Coloncito,El PiÑal,La Fria,La Grita,Michelena,Palmira (tachira),Rubio,San Antonio Del Tachira,San Cristobal (tachira),San Juan De Colon,Santa Ana (tachira),Tariba,UreÑa');
                break;
            case "Trujillo":

                misFunciones::palabras_clave_unica($valor, 'Bocono,La Hoyada,Monay,Sabana De Mendoza,Trujillo,Valera');
                break;
            case "Yaracuy":

                misFunciones::palabras_clave_unica($valor, 'Chivacoa,Nirgua,San Felipe,Yaritagua');
                break;
            case "Zulia":

                misFunciones::palabras_clave_unica($valor, 'Bachaquero,Cabimas,Caja Seca,Ciudad Ojeda,Encontrados,Machiques,Maracaibo,Mene Grande,San Rafael De Mojan (zulia),Santa Barbara Del Zulia,Santa Rita (zulia),Villa Del Rosario');
                break;
        }
    }
    public static function validarestado($valor)
    {
        misFunciones::palabras_clave_unica($valor, 'Amazonas,Anzoategui,Apure,Aragua,Barinas,Bolivar,Carabobo,Cojedes,Delta Amacuro,Distrito Capital,Falcon,Guárico,Lara,Merida,Miranda,Monagas,Nueva Esparta,Portuguesa,Sucre,Tachira,Trujillo,Yaracuy,Zulia');
    }
    public static function validarbanco($valor)
    {
        misFunciones::palabras_clave_unica($valor, '0156,0196,0172,0171,0166,0175,0128,0164,0102,0114,0149,0163,0176,0115,0003,0173,0105,0191,0116,0138,0108,0104,0168,0134,0177,0146,0174,0190,0121,0157,0151,0601,0169,0137');
    }
    public static function convertirbancoastring($valor)
    {
        switch ($valor) {
            case "0156":
                $valor = "100%BANCO";
                break;
            case "0196":
                $valor = "ABN AMRO BANK";
                break;
            case "0172":
                $valor = "BANCAMIGA BANCO MICROFINANCIERO";
                break;
            case "0171":
                $valor = "BANCO ACTIVO BANCO COMERCIAL";
                break;
            case "0166":
                $valor = "BANCO AGRICOLA";
                break;
            case "0175":
                $valor = "BANCO BICENTENARIO";
                break;
            case "0128":
                $valor = "BANCO CARONI  BANCO UNIVERSAL";
                break;
            case "0164":
                $valor = "BANCO DE DESARROLLO DEL MICROEMPRESARIO";
                break;
            case "0102":
                $valor = "BANCO DE VENEZUELA";
                break;
            case "0114":
                $valor = "BANCO DEL CARIBE";
                break;
            case "0149":
                $valor = "BANCO DEL PUEBLO SOBERANO";
                break;
            case "0163":
                $valor = "BANCO DEL TESORO";
                break;
            case "0176":
                $valor = "BANCO ESPIRITO SANTO";
                break;
            case "0115":
                $valor = "BANCO EXTERIOR";
                break;
            case "0003":
                $valor = "BANCO INDUSTRIAL DE VENEZUELA";
                break;
            case "0173":
                $valor = "BANCO INTERNACIONAL DE DESARROLLO";
                break;
            case "0105":
                $valor = "BANCO MERCANTIL ";
                break;
            case "0191":
                $valor = "BANCO NACIONAL DE CREDITO";
                break;
            case "0116":
                $valor = "BANCO OCCIDENTAL DE DESCUENTO";
                break;
            case "0138":
                $valor = "BANCO PLAZA";
                break;
            case "0108":
                $valor = "BANCO PROVINCIAL BBVA";
                break;
            case "0104":
                $valor = "BANCO VENEZOLANO DE CREDITO ";
                break;
            case "0168":
                $valor = "BANCRECER BANCO DE DESARROLLO";
                break;
            case "0134":
                $valor = "BANESCO BANCO UNIVERSAL";
                break;
            case "0177":
                $valor = "BANFANB";
                break;
            case "0146":
                $valor = "BANGENTE";
                break;
            case "0174":
                $valor = "BANPLUS BANCO COMERCIAL";
                break;
            case "0190":
                $valor = "CITIBANK";
                break;
            case "0121":
                $valor = "CORP BANCA";
                break;
            case "0157":
                $valor = "DELSUR BANCO UNIVERSAL";
                break;
            case "0151":
                $valor = "FONDO COMUN";
                break;
            case "0601":
                $valor = "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR";
                break;
            case "0169":
                $valor = "MIBANCO BANCO DE DESARROLLO";
                break;
            case "0137":
                $valor = "SOFITASA";
                break;
        }
        return $valor;
    }
    public static function validarcedula($valor)
    {

        $valor = explode('-', $valor);
        if ($valor[0] !== 'J') {
            $contante = 2;
        } else {
            $contante = 3;
        }
        if (count($valor) !== $contante) {
            misFunciones::$aprobado = false;
        } else {
            misFunciones::palabras_clave_unica($valor[0], 'V,J,E');
            misFunciones::min_length($valor[1], 6);
            misFunciones::max_length($valor[1], 12);
            misFunciones::tipo_valor($valor[1], 'numerico');
            if ($valor[0] === 'J') {
                misFunciones::min_length($valor[2], 1);
                misFunciones::max_length($valor[2], 1);
                misFunciones::tipo_valor($valor[2], 'numerico');
            }
        }
    }
    public static function telefonomovilvenezolano($valor)
    {

        $valor = explode('-', $valor);
        if (count($valor) !== 2) {
            misFunciones::$aprobado = false;
        } else {
            misFunciones::palabras_clave_unica($valor[0], '0426,0416,0424,0414,0412');
            misFunciones::min_length($valor[1], 7);
            misFunciones::max_length($valor[1], 7);
            misFunciones::tipo_valor($valor[1], 'numerico');
        }
    }
    public static function telefonogeneralvenezolano($valor)
    {

        $valor = explode('-', $valor);
        if (count($valor) !== 2) {
            misFunciones::$aprobado = false;
        } else {
            misFunciones::palabras_clave_unica($valor[0], '0426,0416,0424,0414,0412,0248,0281,0282,0283,0240,0244,0273,0284,0285,0286,0288,0289,0241,0242,0243,0245,0249,0258,0259,0268,0269,0279,0235,0238,0246,0247,0252,0274,0234,0239,0287,0291,0292,0295,0255,0256,0257,0293,0294,0276,0277,0278,0272,0212,0251,0253,0254,0261,0262,0263,0264,0265,0266,0267,0271,0275');
            misFunciones::min_length($valor[1], 7);
            misFunciones::max_length($valor[1], 7);
            misFunciones::tipo_valor($valor[1], 'numerico');
        }
    }

    public static function telefonocasavenezolano($valor)
    {

        $valor = explode('-', $valor);
        if (count($valor) !== 2) {
            misFunciones::$aprobado = false;
        } else {
            misFunciones::palabras_clave_unica($valor[0], '0248,0281,0282,0283,0240,0244,0273,0284,0285,0286,0288,0289,0241,0242,0243,0245,0249,0258,0259,0268,0269,0279,0235,0238,0246,0247,0252,0274,0234,0239,0287,0291,0292,0295,0255,0256,0257,0293,0294,0276,0277,0278,0272,0212,0251,0253,0254,0261,0262,0263,0264,0265,0266,0267,0271,0275');
            misFunciones::min_length($valor[1], 7);
            misFunciones::max_length($valor[1], 7);
            misFunciones::tipo_valor($valor[1], 'numerico');
        }
    }
    public static function agregar_3puntos($valor)
    {
        $cedulaconpuntos = "";
        $valor = strval($valor);
        $x = strlen($valor);
        while ($x >= 0) {

            if ($x === 0) {
                $cedulaconpuntos[0];
            }
            if ($x === 1) {
                $cedulaconpuntos = $valor[0] . $cedulaconpuntos;
            }
            if ($x === 2) {
                $cedulaconpuntos = $valor[0] . $valor[1] . $cedulaconpuntos;
            }
            if ($x === 3) {
                $cedulaconpuntos = $valor[0] . $valor[1] . $valor[2] . $cedulaconpuntos;
            }

            if ($x > 3) {

                $cedulaconpuntos = '.' . $valor[$x - 3] . $valor[$x - 2] . $valor[$x - 1] . $cedulaconpuntos;
            }
            $x--;
            $x--;
            $x--;
        }
        return ($cedulaconpuntos);
    }
    public static function puntosdetres($valor)
    {
        $cedulaconpuntos = "";
        $valor = strval($valor);
        $x = strlen($valor);
        while ($x >= 0) {

            if ($x === 0) {
                $cedulaconpuntos[0];
            }
            if ($x === 1) {
                $cedulaconpuntos = $valor[0] . $cedulaconpuntos;
            }
            if ($x === 2) {
                $cedulaconpuntos = $valor[0] . $valor[1] . $cedulaconpuntos;
            }
            if ($x === 3) {
                $cedulaconpuntos = $valor[0] . $valor[1] . $valor[2] . $cedulaconpuntos;
            }

            if ($x > 3) {

                $cedulaconpuntos = '.' . $valor[$x - 3] . $valor[$x - 2] . $valor[$x - 1] . $cedulaconpuntos;
            }
            $x--;
            $x--;
            $x--;
        }
        return ($cedulaconpuntos);
    }
    public static function funcion_revertirfecha($valor)
    {
        $fecha = $valor[6] . $valor[7] . '/' . $valor[4] . $valor[5] . '/' . $valor[0] . $valor[1] . $valor[2] . $valor[3];
        return ($fecha);
    }

    public static function booleano($valor)
    {

        if ($valor !== 0 && $valor !== 1 && $valor !== "0" && $valor !== "1" && $valor !== true && $valor !== false) {
            misFunciones::$aprobado = false;
        }
    }
    public static function comprobarhex($valor)
    {

        if ($valor[0] === '#' && strlen($valor) === 7) {
            $valor2 = explode('#', $valor);

            if (ctype_xdigit($valor2[1])) {
            } else {
                misFunciones::$aprobado = false;
            }
        }
    }

    //desonocimiento de uso
    public static function laenie($valor)
    {
        $valor = str_replace("Ã±", "ñ", $valor);
        return ($valor);
    }
    //desconocimiento de uso
    public static function conversoruft($valor)
    {
        $pos = strpos($valor, "Ã“");

        if ($pos !== false) {
            $valor = str_replace("Ã“", "Ó", $valor);
        }
        return ($valor);
    }
    public static function quitarpisos($valor)
    {
        $valor = str_replace("_", " ", $valor);
        return ($valor);
    }
    public static function ponerpisos($valor)
    {
        $valor = str_replace(" ", "_", $valor);
        return ($valor);
    }

    public static function validarfecha($valor)
    {

        if (strlen($valor) === 8) {
            $ano = $valor[0] . $valor[1] . $valor[2] . $valor[3];
            $mes = $valor[4] . $valor[5];
            $dia = $valor[6] . $valor[7];
        } else {
            $ano = $valor[0] . $valor[1] . $valor[2] . $valor[3];
            $mes = $valor[5] . $valor[6];
            $dia = $valor[8] . $valor[9];
        }
        if (checkdate($mes, $dia, $ano) === false) {
            misFunciones::$aprobado = false;
        }
        return $ano . '-' . $mes . '-' . $dia;
    }
    //posible desuso
    public static function fechadia($valor)
    {
        if ($valor[6] === "0") {
            $valor = $valor[7];
        } else {
            $valor = $valor[6] . $valor[7];
        }
        return ($valor);
    }
    //posible desuso
    public static function fechames($valor)
    {
        if ($valor[4] === "0") {
            $valor = $valor[5];
        } else {
            $valor = $valor[4] . $valor[5];
        }
        return ($valor);
    }
    //posible desuso
    public static function fechaano($valor)
    {
        $valor = $valor[0] . $valor[1] . $valor[2] . $valor[3];
        return ($valor);
    }
    //posible desuso
    public static function correolocal($valor)
    {
        $valor = explode('@', $valor);
        return ($valor[0]);
    }
    //posible desuso
    public static function correodominio($valor)
    {
        $valor = explode('@', $valor);
        return ('@' . $valor[1]);
    }
    //posible desuso
    public static function validarcorreo($valor)
    {

        $valor = explode('@', $valor);
        if (count($valor) === 2) {
            misFunciones::min_length($valor[0], 3);
            misFunciones::max_length($valor[0], 20);
            misFunciones::tipo_valor($valor[0], 'alfanumericosimbolos');
            misFunciones::palabras_clave_varios($valor[1], 'hotmail,gmail,yahoo,outlook');
        } else {
            misFunciones::$aprobado = false;
        }
    }
    public static function permitir_vacio($valor)
    {

        if (isset($valor[0])) {
            if ($valor === "") {
                misFunciones::$aprobado = false;
            }
        }
    }
    //hay que actualizar
    public static function email($direccion)
    {

        $Sintaxis = '#^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,6}$#';
        if (preg_match($Sintaxis, $direccion)) {
        } else {
            misFunciones::$aprobado = false;
        }
    }
    public static function min_length($valor, $minlength)
    {

        if (strlen($valor) < $minlength) {
            misFunciones::$aprobado = false;
        }
    }
    public static function max_length($valor, $maxlength)
    {

        if (strlen($valor) > $maxlength) {
            misFunciones::$aprobado = false;
        }
    }
    public static function palabras_clave_unica($valor, $palabrasclave)
    {

        $valor = strval($valor);
        $palabrasclave = explode(',', $palabrasclave);
        $palabrasclavecontador = 0;
        for ($x = 0; $x < count($palabrasclave); $x++) {
            if ($valor === $palabrasclave[$x]) {
                $palabrasclavecontador++;
            }
        }
        if ($palabrasclavecontador !== 1) {
            misFunciones::$aprobado = false;
        }
    }

    public static function passmd5($valor)
    {
        $valor = md5($valor . '!#and#!');
        return $valor;
    }
    public static function palabras_clave_varios($valor, $palabrasclave)
    {

        $palabrasclave = explode(',', $palabrasclave);
        $palabrasclavecontador = 0;
        $sumandoindex = -1;

        for ($x = 0; $x < count($palabrasclave) - 1; $x++) {
            if (strpos($valor, $palabrasclave[$x]) !== false) {

                if ($palabrasclave[count($palabrasclave) - 1] === "orden") {

                    if (strpos($valor, $palabrasclave[$x]) > $sumandoindex) {

                        $sumandoindex = strpos($valor, $palabrasclave[$x]);
                    } else {
                        misFunciones::$aprobado = false;
                    }
                }
                $palabrasclavecontador++;
            }
        }
        if ($palabrasclavecontador !== count($palabrasclave) - 1) {
            misFunciones::$aprobado = false;
        }
    }
    public static function iguales($valor, $valor2)
    {

        if ($valor !== $valor2) {
            misFunciones::$aprobado = false;
        }
    }
    //hay que actualizar
    public static function password($valor)
    {

        $permitidosnumeros = '1234567890';
        $permitidossimbolos = "!#$%&/()=?¡+-.,¿|°";
        $permitidosmayusculas = "QWERTYUIOPASDFGHJKLZXCVBNM";
        $permitidosminusculas = "qwertyuiopasdfghjklzxcvbnm";
        $mayusculas = false;
        $minusculas = false;
        $simbolos = false;
        $numeros = false;
        if ($valor[0] === "") {
            misFunciones::$aprobado = false;
        }
        if (strlen($valor) < 8 || strlen($valor) > 16) {
            misFunciones::$aprobado = false;
        }
        for ($x = 0; $x < strlen($valor); $x++) {
            if (strpos($permitidosmayusculas, $valor[$x]) !== false) {
                $mayusculas = true;
            }
            if (strpos($permitidosminusculas, $valor[$x]) !== false) {
                $minusculas = true;
            }
            if (strpos($permitidossimbolos, $valor[$x]) !== false) {
                $simbolos = true;
            }
            if (strpos($permitidosnumeros, $valor[$x]) !== false) {
                $numeros = true;
            }
        }
        if ($minusculas === false || $mayusculas === false || $simbolos === false || $numeros === false) {
            misFunciones::$aprobado = false;
        }
    }
    public static function validarmd5($valor)
    {

        misFunciones::min_length($valor, 32);
        misFunciones::max_length($valor, 32);
        misFunciones::tipo_valor($valor, 'alfanumerico');
    }
    //desconocimiento de uso
    public static function vbase64($s, $onlyReturn = false)
    {

        $s = explode('base64,', $s);

        if (isset($s[1])) {
            $s = $s[1];
        } else {
            $s = $s[0];
        }
        // Check if there are valid base64 characters
        if (!preg_match('/^[a-zA-Z0-9\/\r\n+]*={0,2}$/', $s)) {
            return false;
        }

        // Decode the string in strict mode and check the results
        $decoded = base64_decode($s, true);
        if (false === $decoded) {
            return false;
            if ($onlyReturn) {
                misFunciones::$aprobado = false;
            }

        }

        // Encode the string again
        if (base64_encode($decoded) != $s) {
            return false;
            if ($onlyReturn) {
                misFunciones::$aprobado = false;
            }

        }

        return true;

    }
    //desconocimiento de uso
    public static function normaliza($cadena)
    {
        $originales = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŔŕ';
        $modificadas = 'aaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuyybyRr';
        $cadena = utf8_decode($cadena);
        $cadena = strtr($cadena, utf8_decode($originales), $modificadas);
        $cadena = strtolower($cadena);
        return utf8_encode($cadena);
    }
    public static function arrayToString($valor, $property = false, $separator = ',')
    {
        if (is_string($valor)) {
            return $valor;
        }

        $i = 1;
        $string = "";
        if (count($valor) > 0) {
            foreach ($valor as $vi) {
                if ($property !== false) {
                    try {
                        if (is_object($vi) === true) {
                            $vi = object_get($vi, $property);
                        }
                    } catch (exception $e) {
                    }
                }
                if ($i === count($valor)) {
                    $string = $string . $vi;
                } else {
                    $string = $string . $vi . $separator;
                }
                $i++;
            }
        }
        return $string;
    }
    //actualizar
    public static function tipo_valor($valor, $tipovalor)
    {

        $valor = misFunciones::normaliza($valor);

        $permitidosalfa = 'qwertyuiopasdfghjklzxcvbñnm QWERTYÑUIOPASDFGHJKLZXCVBNM';
        $permitidosalfanumericoparentesis = 'qwertyuiopasdfghjklzxcvbñnm QWERTYÑUIOPASDFGHJKLZXCV()BNM';
        $permitidosalfanumerico = 'qwertyuiopasdfghjkñlzxcvbnm QÑWERTYUIOPASDFGHJKLZXCVBNM1234567890';
        $permitidosalfanumericosimbolos = 'qwertyuiopasdfghjklzxcñvbnm QWERTÑYUIOPASDFGHJKLZXCVBNM1234567890!#&/()"=-%_¡¿|°;.,';
        if (isset($valor[0])) {
            switch ($tipovalor) {

                case 'alfa':
                    if ($valor[0] === " ") {
                        misFunciones::$aprobado = false;
                    }

                    for ($x = 0; $x < strlen($valor); $x++) {
                        if (strpos($permitidosalfa, $valor[$x]) === false) {
                            misFunciones::$aprobado = false;
                        }
                    }

                    break;
                case 'alfanumerico':
                    if ($valor[0] === " ") {
                        misFunciones::$aprobado = false;
                    }

                    for ($x = 0; $x < strlen($valor); $x++) {
                        if (strpos($permitidosalfanumerico, $valor[$x]) === false) {
                            misFunciones::$aprobado = false;
                        }
                    }
                    break;
                case 'alfanumericoparentesis':
                    if ($valor[0] === " ") {
                        misFunciones::$aprobado = false;
                    }

                    for ($x = 0; $x < strlen($valor); $x++) {
                        if (strpos($permitidosalfanumericoparentesis, $valor[$x]) === false) {
                            misFunciones::$aprobado = false;
                        }
                    }
                    break;
                case 'alfanumericosimbolos':
                    if ($valor[0] === " ") {
                        misFunciones::$aprobado = false;
                    }

                    for ($x = 0; $x < strlen($valor); $x++) {
                        if (strpos($permitidosalfanumericosimbolos, $valor[$x]) === false) {
                            misFunciones::$aprobado = false;
                        }
                    }
                    break;
                case 'numerico':
                    if (!is_numeric($valor)) {
                        misFunciones::$aprobado = false;
                    }
                    break;
                case 'decimal':
                    $valor = explode('.', $valor);
                    if (count($valor) <= 2) {
                        for ($i = 0; $i < count($valor); $i++) {
                            if (!is_numeric($valor[$i])) {
                                misFunciones::$aprobado = false;
                            }
                        }
                    } else {
                        misFunciones::$aprobado = false;
                    }
                    break;
            }
        }
    }

    public static function rango_numero($valor, $min, $max)
    {

        if (!is_numeric($valor) || intval($valor) < intval($min) || intval($valor) > intval($max)) {
            misFunciones::$aprobado = false;
        }
    }
    public static function validar_capcha($valor)
    {
        global $secret, $response, $reCaptcha;
        $postdata = http_build_query(
            array(
                'secret' => $secret, //secret KEy provided by google
                'response' => $valor, // g-captcha-response string sent from client
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            )
        );
        $opts = array(
            'http' => array(
                'method' => 'POST',
                'header' => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata,
            ),
        );
        $context = stream_context_create($opts);
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify", false, $context);
        $response = json_decode($response);
        if ($response->success != false) {
        } else {
            misFunciones::$aprobado = false;
        }
    }
}
