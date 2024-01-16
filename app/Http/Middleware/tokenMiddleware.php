<?php

namespace App\Http\Middleware;

use Closure;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class tokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (session()->has('token')) {
            $client = new Client();
            $token = 'Bearer ' . session('token');

            $response = $client->post(env('APP_URL_WP') . '/wp-json/jwt-auth/v1/token/validate', [
                'headers' => [
                    'Authorization' => $token,
                ],
                'verify' => false,
            ]);
            $responseData = json_decode($response->getBody(), true);
            if ($responseData["code"] !== 'jwt_auth_valid_token') {
                return response()->json('Token Invalido');
            } else {
                return $next($request);}
        } else {
            $response = response()->json('Sin Token Bearer');
            return $response;

        }
    }
}