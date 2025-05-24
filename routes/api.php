<?php

use App\Http\Controllers\Api\AnalyticsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PlatformController;



Route::middleware('auth:sanctum')->group(function () {

    //Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    //post routes
    Route::get('/posts/filterByStatusAndDate', [PostController::class, 'filterByStatusAndDate']);
    Route::apiResource('posts', PostController::class);

    Route::post('posts/{post}/publish',[PostController::class,'publish']);


    //call all available platforms
    Route::get('/platforms',[PlatformController::class,'index']);
    Route::post('platforms/{platform}/toggle', [PlatformController::class, 'toggle']);

    //for analytics
    Route::get('/analytics',[AnalyticsController::class,'index']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//for test
Route::middleware('auth:sanctum')->get('/test-auth', function() {
    return response()->json([
        'user_id' => auth()->id(),
        'user' => auth()->user()
    ]);
});
