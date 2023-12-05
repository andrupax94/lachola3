
<?php

/*
Plugin Name: La chola Plugin
Description: Muestra una página web de un subdominio e inicia sesión automáticamente.
Version: 1.0
Author: Jairo y Andres
*/
function obtener_token_jwt_actual() {
    // Obtener el ID del usuario actual
    $user_id = get_current_user_id();

    // Obtener el nombre de usuario
    $username = get_userdata($user_id)->user_login;

    // Obtener la URL de la foto del perfil del usuario
    $avatar_url = get_avatar_url($user_id);

    // Obtener el rol del usuario
    $user_roles = get_userdata($user_id)->roles;
    $role = !empty($user_roles) ? $user_roles[0] : 'Sin rol asignado';

    // Retornar los resultados como un array
    return array(
        'nombre_usuario' => $username,
        'url_avatar' => $avatar_url,
        'rol_usuario' => $role,
    );
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
        'La Chola Eventos',
        'La Chola Eventos',
        'manage_options',
        'subdominio-plugin',
        'mostrar_subdominio_contenido'
    );
}
?>
