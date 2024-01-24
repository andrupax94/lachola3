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
Route::get('/getToken', [UserController::class, 'getToken']);
Route::post('/setToken', [UserController::class, 'setToken']);
Route::post('/getUser', [UserController::class, 'getUser']);
Route::post('/procesingDelete', [UserController::class, 'procesingDelete']);

//pendiente Eliminar
Route::post('/logIn', [UserController::class, 'logIn']);
Route::post('/dropAll', [UserController::class, 'dropAll']);

$mEventos = ['procesing', 'token'];

Route::post('/getEventos', [eventosController::class, 'getEventos'])->middleware($mEventos);
Route::post('/getEventosJ', [eventosController::class, 'getEventosJ'])->middleware($mEventos);
Route::post('/extractFestivalData', [eventosController::class, 'extractFestivalData'])->middleware($mEventos);
Route::post('/extractFestivalDataGroup', [eventosController::class, 'extractFestivalDataGroup'])->middleware($mEventos);
Route::post('/saveImgs', [eventosController::class, 'saveImgs'])->middleware($mEventos);
Route::post('/saveEvents', [eventosController::class, 'saveEvents'])->middleware($mEventos);
Route::post('/saveEventsAll', [eventosController::class, 'saveEventsAll'])->middleware($mEventos);