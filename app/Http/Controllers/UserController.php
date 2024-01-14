<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function setToken(Request $request)
    {
        try {
            $token = $request->input('token');
            session(['token' => $token]); // Utiliza session(['clave' => 'valor']) para almacenar datos en sesión
            return response()->json(session('token'));

        } catch (Exception $e) {
            return response()->json('Error Al Asignar El Token');
        }
    }
    //TODO PENDIENTE ELIMINAR
    public function getToken(Request $request)
    {
        if (session()->has('token')) {
            return response()->json(true); // No necesitas utilizar session(['token'])
        } else {
            return response()->json('Sin Token De Acceso');
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

    public function getUser(Request $request)
    {
        $client = new Client();
        $token = 'Bearer ' . session('token');
        try {
            $response = $client->post(env('APP_URL_WP') . '/wp-json/jwt-auth/v1/token/validate', [
                'headers' => [
                    'Authorization' => $token,
                ],
                'verify' => false,
            ]);
            $responseData = json_decode($response->getBody(), true);
            if ($responseData["code"] !== 'jwt_auth_valid_token') {
                throw new Exception('');
            } else {
                try {
                    $response = $client->post(env('APP_URL_WP') . '/wp-json/wp/v2/users/me', [
                        'headers' => [
                            'Authorization' => $token,
                        ],
                        'verify' => false,
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
