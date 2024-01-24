<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;

class indexController extends Controller
{
    public function index()
    {
        $filePath = public_path('index.html');

        if (File::exists($filePath)) {
            return File::get($filePath);
        }

        abort(404); // Manejar si el archivo no existe
    }
}