<?php

use App\Http\Controllers\EventosController;
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
Route::post('/getToken', [UserController::class, 'getToken'])->middleware(['token']);
Route::post('/setToken', [UserController::class, 'setToken']);
Route::post('/getUser', [UserController::class, 'getUser']);

Route::post('/getEventos', [eventosController::class, 'getEventos'])->middleware(['procesing', 'token']);
Route::post('/getEventosJ', [eventosController::class, 'getEventosJ'])->middleware(['procesing', 'token']);
Route::post('/extractFestivalData', [eventosController::class, 'extractFestivalData'])->middleware(['procesing', 'token']);
Route::post('/extractFestivalDataGroup', [eventosController::class, 'extractFestivalDataGroup'])->middleware(['procesing', 'token']);