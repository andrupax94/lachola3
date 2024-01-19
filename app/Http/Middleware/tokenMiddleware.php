<?php

namespace App\Http\Middleware;

use App\Http\Controllers\UserController;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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
            $validate = UserController::validar($request);
            if ($validate === true) {
                if (Cache::has('eventos')) {
                    Cache::put('eventos', Cache::get('eventos'));
                }
                if (Cache::has('eventosG')) {
                    Cache::put('eventosG', Cache::get('eventosG'));
                }
                return $next($request);
            } else {
                return response()->json($validate);
            }
        } else {
            $response = response()->json('Sin Token Bearer');
            return $response;

        }
    }
}