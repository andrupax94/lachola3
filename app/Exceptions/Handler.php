<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Support\Facades\Cache;
class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }
    public function render($request, Throwable $e)
    {
        // Ejecutar la lógica específica antes de manejar la excepción
        Cache::forget('procesing');

        // Devolver el error en formato JSON
        return response()->json(['error' => $e->getMessage()], 500);

        // Puedes comentar la línea anterior y descomentar la siguiente
        // si prefieres manejar la excepción de la forma predeterminada
        // return parent::render($request, $e);
    }
}
