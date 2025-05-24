<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

//Added
use App\Models\User;
use Illuminate\Support\Facades\Auth;
//Added
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;

class AuthController extends Controller
{
        //Register function
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),

        ]);



        return response()->json([
            'status'=> 'success',
            'data' =>[
                'user' => $user,
                ]
        ]);

    }

    //Login function
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)){
            return response([
                'message'=>'Provided email or password is incorrect'
            ], 422);
        }

        $user = Auth::user();

    // Generate new token on login
    $token = $user->createToken('main')->plainTextToken;


        return response()->json([
            'status'=> 'success',
            'data' =>[
                'user' => $user,
                'token' => $token,
                ]
        ]);
    }


        //Get User function for logged in user and dashboard
    public function user(Request $request)
    {
        return $request->user();
    }

        //Logout function
    public function logout(Request $request)
    {
     /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 201);
    }
}
