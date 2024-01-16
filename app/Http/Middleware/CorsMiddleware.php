<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {

        $response = $next($request);

        $response->headers->set('Access-Control-Allow-Origin', 'http://127.0.0.1:4200'); // Reemplaza con tu dominio de Angular
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization,Connection,session-id');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}