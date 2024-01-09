<?php

use App\Http\Controllers\EventosController;
use App\Http\Controllers\python;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
 */

Route::post('/wpDirect', function (Request $request) {
    return view('index');
});
Route::post('/getToken', [UserController::class, 'getToken']);
Route::post('/dameSesion', [UserController::class, 'dameSesion']);

Route::post('/getEventos', [eventosController::class, 'getEventos'])->middleware('procesing');
Route::post('/getEventosJ', [eventosController::class, 'getEventosJ'])->middleware('procesing');
Route::post('/extractFestivalData', [eventosController::class, 'extractFestivalData'])->middleware('procesing');
Route::post('/extractFestivalDataGroup', [eventosController::class, 'extractFestivalDataGroup'])->middleware('procesing');

Route::post('/extraeP', [python::class, 'extrae']);
Route::post('/extraeP2', [python::class, 'extrae2']);
