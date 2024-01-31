<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;

class UserController extends Controller
{
    public function procesingDelete(Request $request)
    {
        Cache::forget('procesing');
        Cache::forget('eventos');
        Cache::forget('eventosG');

        return response()->json(true);
    }
    public function setToken(Request $request)
    {
        try {
            $token = $request->input('token');
            session(['token' => $token]);

            return response()->json(session('token'));

        } catch (Exception $e) {
            return response()->json('Error Al Asignar El Token');
        }
    }

    public function getToken(Request $request)
    {

        return response()->json(true); // No necesitas utilizar session(['token'])

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
        $validate = UserController::validar($request);
        if ($validate === true) {
            try {
                $response = $client->post(config('app.urlWp') . '/wp-json/wp/v2/users/me', [
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
                session(['user' => $usuario]);
                // Puedes manipular la respuesta o devolverla directamente
                return response()->json(session('user'));
            } catch (\Exception $e) {
                // Maneja errores en la solicitud
                return response()->json('Error al obtener los datos del usuario');
            }
        } else {
            return response()->json($validate);

        }

    }
    public static function validar(Request $request)
    {
        $client = new Client();
        $token = 'Bearer ' . session('token');
        try {
            $response = $client->post(config('app.urlWp') . '/wp-json/jwt-auth/v1/token/validate', [
                'headers' => [
                    'Authorization' => $token,
                ],
                'verify' => false,
            ]);
            $responseData = json_decode($response->getBody(), true);
            if ($responseData["code"] !== 'jwt_auth_valid_token') {
                return 'Token Invalido';
            } else {
                return true;
            }
        } catch (\Exception $e) {
            return 'Error Al intentar validar el token';
        }

    }
    public function logIn(Request $request)
    {
        $client = new Client();

        $username = $request->input('username') !== null ? $request->input('username') : '';
        $password = $request->input('password') !== null ? $request->input('password') : '';
        if ($username === '' || $password === '') {

            return response()->json('<strong>Error</strong>: Sin Datos De Usuario');
        }

        $formParams = [
            "username" => $username,
            "password" => $password,
        ];

        $response = $client->post(config('app.urlWp') . '/wp-json/jwt-auth/v1/token', [
            'verify' => false,
            'http_errors' => false,
            'form_params' => $formParams,
        ]);

        $responseData = json_decode($response->getBody(), true);
        $token = isset($responseData["token"]) ? $responseData["token"] : false;
        if ($token) {
            session(['token' => $token]);
            $validate = UserController::validar($request);
            if ($validate !== true) {
                session()->forget('token');
            }
            return response()->json($validate);
        } else {

            return response()->json($responseData["message"]);
        }

    }
    public function logOut(Request $request)
    {

        Session::flush();
        return response()->json('Cerro Sesion Correctamente');
    }

}
