<?php

/*
Plugin Name: Subdominio Plugin
Description: Muestra una página web de un subdominio e inicia sesión automáticamente.
Version: 1.0
Author: Tu Nombre
*/
use Firebase\JWT\JWT;

// Hook para ejecutar la función después de iniciar sesión
add_action('wp_login', 'generar_token_despues_de_iniciar_sesion', 10, 2);

function generar_token_despues_de_iniciar_sesion($user_login, $user)
{
    // Configura la clave secreta (puedes cambiarla según tus necesidades)
    $clave_secreta = '.Ana*123';

    // Obtiene el ID del usuario actual
    $emisor = 'http://wpgraphql.test'; // Reemplaza con tu dominio

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

    // Puedes hacer lo que necesites con el token aquí
    // Por ejemplo, puedes almacenarlo en algún lugar o enviarlo al cliente

    // Si deseas redirigir al usuario después de iniciar sesión, puedes hacerlo así

}


// Esta función se ejecutará cuando se active el plugin
function mostrar_subdominio_contenido() {
   
       
       
       $html=file_get_contents(plugin_dir_path(__FILE__) .'index.html');
       echo $html;
    //    $text='   popupWindow.document.write("'.$html.'");';
    //    echo '<div id="angular-app-container">';
    // echo '<script>';
    // echo 'window.addEventListener("DOMContentLoaded", function() {';
    // echo '  var popupWindow = window.open("", "NombreDeLaVentana", "width=800, height=600");';
    // echo '  if (popupWindow) {';
    // echo $text;
    // echo '    popupWindow.document.close();';
    // echo '  } else {';
    // echo '    console.error("Error al abrir la ventana emergente");';
    // echo '  }';
    // echo '});';
    // echo '</script>';
    // echo '</div>';
    }
    

// Esta acción agrega la función anterior al contenido de la página
add_action('the_content', 'mostrar_subdominio_contenido');

// Esta acción agrega un menú en la barra lateral del panel de administración
add_action('admin_menu', 'subdominio_plugin_menu');

// Esta función crea el menú en la barra lateral
function subdominio_plugin_menu() {
    add_menu_page(
        'Subdominio Plugin',
        'Subdominio',
        'manage_options',
        'subdominio-plugin',
        'mostrar_subdominio_contenido'
    );
}
?>