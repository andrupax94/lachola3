<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarAppUrlWp
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $maxAttempts = 10; // Número máximo de intentos
        $currentAttempt = 0;
        $appUrlWp = env('APP_URL_WP');

        // Intentar obtener la variable hasta que no sea nula o alcance el límite de intentos
        while ($appUrlWp === null && $currentAttempt < $maxAttempts) {
            usleep(100000); // Esperar 100ms antes de intentar nuevamente
            $appUrlWp = env('APP_URL_WP');
            $currentAttempt++;
        }

        // Verificar si la variable de entorno APP_URL_WP no es nula
        if ($appUrlWp === null || $appUrlWp === undefined) {
            env('APP_URL_WP', 'https://lachola.andreseduardo.es');
            // Puedes personalizar la respuesta de error según tus necesidades
            return response()->json(['error' => 'La variable de entorno APP_URL_WP no está configurada.'], 500);
        }

        return $next($request);
    }
}