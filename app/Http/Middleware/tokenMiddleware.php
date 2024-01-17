<?php

namespace App\Http\Middleware;

use App\Http\Controllers\UserController;
use Closure;
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
            $validate = UserController::validar($request);
            if ($validate === true) {
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
