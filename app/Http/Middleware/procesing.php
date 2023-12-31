<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Cache;
class procesing
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Cache::has('procesing')) {
            // if (false) {
                if (Cache::get('procesing') === true) {
                    Cache::forget('procesing');
                    return response()->json([
                        'status' => 'finished',
                    ]);
                } else {
                    return response()->json([
                        'status' => Cache::get('procesing'),
                    ]);
                }
            }
            else{
        return $next($request);
            }
    }
}
