<?php

/*
Plugin Name: Subdominio Plugin
Description: Muestra una página web de un subdominio e inicia sesión automáticamente.
Version: 1.0
Author: Tu Nombre
 */
use Firebase\JWT\JWT;
define('JWT_AUTH_SECRET_KEY', 'labamba');
function custom_image_url_endpoint()
{
    // Registra el endpoint para obtener la URL de la imagen por ID
    register_rest_route('custom/v1', '/image/(?P<id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_image_by_id',
    ));
}

add_action('rest_api_init', 'custom_image_url_endpoint');

function get_image_by_id($data)
{
    $attachment_id = $data['id'];
    $image_url = wp_get_attachment_url($attachment_id);

    if ($image_url) {
        // Obtiene el tipo de contenido de la imagen
        $filetype = wp_check_filetype($image_url, null);

        // Configura las cabeceras para la respuesta
        header("Content-Type: {$filetype['type']}");
        header('Content-Disposition: inline; filename="' . basename($image_url) . '"');

        // Lee y envía la imagen al navegador
        readfile($image_url);
        exit;
    } else {
        // Maneja el caso en el que la imagen no se encuentre
        return new WP_Error('image_not_found', 'Imagen no encontrada', array('status' => 404));
    }
}
function maximum_api_filter($query_params)
{
    $query_params['per_page']["maximum"] = 1000;
    return $query_params;
}
add_filter('rest_evento_collection_params', 'maximum_api_filter');
// Hook para ejecutar la función después de iniciar sesión
add_action('wp_login', 'generar_token_despues_de_iniciar_sesion', 10, 2);
function obtenerURLActual($subdominio = null)
{
    $protocolo = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];

    // Si se proporciona un subdominio, lo reemplazamos
    if ($subdominio !== null) {
        $host_parts = explode('.', $host);
        $host_parts[0] = $subdominio;
        $host = implode('.', $host_parts);
    }

    return $protocolo . "://" . $host;
}

function generar_token_despues_de_iniciar_sesion($user_login, $user)
{
    // Configura la clave secreta (puedes cambiarla según tus necesidades)
    $clave_secreta = '.Ana*123';

    // Obtiene el ID del usuario actual
    $emisor = obtenerURLActual(); // Reemplaza con tu dominio
    $api_url = obtenerURLActual('laravel');
// Obtiene el ID del usuario actual
    $user_id = get_current_user_id();

// Configura la información del token
    $token_data = array(
        'iss' => $emisor,
        'data' => [
            'user' => [
                'id' => $user_id,
            ],
        ],
        'exp' => strtotime("+1 day"), // Configura la expiración del token
    );

    // Asegúrate de tener la clave secreta en el segundo argumento
    $token = JWT::encode($token_data, $clave_secreta, 'HS256');
    // Obtener la URL actual
    $current_url = "http" . (isset($_SERVER['HTTPS']) ? "s" : "") . "://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];

// Datos a enviar
    $data = array(
        'token' => $token,
    );

// Configurar la solicitud cURL
    $options = array(
        CURLOPT_URL => $api_url . '/api/setToken',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($data),
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/x-www-form-urlencoded',
        ),
    );

// Iniciar la solicitud cURL
    $curl = curl_init();
    curl_setopt_array($curl, $options);

// Ejecutar la solicitud y capturar la respuesta
    $response = curl_exec($curl);
    $error = curl_error($curl);

// Cerrar la solicitud cURL
    curl_close($curl);
}

// Esta función se ejecutará cuando se active el plugin
function mostrar_subdominio_contenido()
{
    if (!is_admin()) {
        return; // No mostrar el contenido del subdominio en estos casos
    }

    $html = file_get_contents(plugin_dir_path(__FILE__) . 'index.html');
    echo $html;

}

// Esta acción agrega la función anterior al contenido de la página
add_action('the_content', 'mostrar_subdominio_contenido');

// Esta acción agrega un menú en la barra lateral del panel de administración
add_action('admin_menu', 'subdominio_plugin_menu');

// Esta función crea el menú en la barra lateral
function subdominio_plugin_menu()
{
    add_menu_page(
        'La Chola Eventos',
        'La Chola Eventos',
        'manage_options',
        'La Chola Plugin',
        'mostrar_subdominio_contenido'
    );
}