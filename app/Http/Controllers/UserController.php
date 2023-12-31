<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getToken(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        // Realiza la solicitud POST a la URL de obtención del token
        $client = new Client();

        try {
            $response = $client->post(env('APP_URL_WP') . '/wp-json/jwt-auth/v1/token', [
                'form_params' => [
                    'username' => $username,
                    'password' => $password,
                ],
            ]);

            // Decodifica la respuesta JSON
            $responseData = json_decode($response->getBody(), true);

            return UserController::getData($request, $responseData);
        } catch (\Exception $e) {
            // Maneja errores en la solicitud
            return response()->json([
                'error' => 'Error al obtener el token',
                'mensaje' => $e->getMessage(),
                'codigo' => 2,
            ], 500);

        }

    }
    public function dameSesion(Request $request)
    {
        if (session()->has('username')) {
            $user = session()->all();
            return response()->json([
                'user' => $user,
                'mensaje' => 'OK',
                'error' => '',
            ]);

        } else {
            return response()->json([
                'codigo' => 2,
                'mensaje' => 'No Login',
                'error' => '',
            ]);
        }
    }

    public static function getData(Request $request, $response)
    {
        $client = new Client();
        $token = 'Bearer ' . $response['token'];
        try {
            $response = $client->post(env('APP_URL_WP') . '/wp-json/jwt-auth/v1/token/validate', [
                'headers' => [
                    'Authorization' => $token,
                ],
            ]);
            $responseData = json_decode($response->getBody(), true);
            if($responseData["code"]!=='jwt_auth_valid_token')
                 throw new Exception('');
            else{
                try {
                    $response = $client->post(env('APP_URL_WP') . '/wp-json/wp/v2/users/me', [
                        'headers' => [
                            'Authorization' => $token,
                        ],
                    ]);
                    // Decodifica la respuesta JSON
                    $responseData = json_decode($response->getBody(), true);

                    // Puedes manipular la respuesta o devolverla directamente
                    $usuario = [
                        'username' => $responseData['username'],
                        'rol' => implode(', ', $responseData['roles']),
                        'avatar' => $responseData['avatar_urls']['96'],
                    ];
                    session()->put($usuario);
                    // Puedes manipular la respuesta o devolverla directamente
                    return response()->json(session()->all());
                } catch (\Exception $e) {
                    // Maneja errores en la solicitud
                    return response()->json(['error' => 'Error al obtener los datos del usuario'], 500);
                }
            }
        } catch (\Exception $e) {
            // Maneja errores en la solicitud
            return response()->json([
                'error' => 'Error al validar Token',
                'mensaje' => $e->getMessage(),
                'codigo' => 2,
            ], 500);
        }
    }
}
