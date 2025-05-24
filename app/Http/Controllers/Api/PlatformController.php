<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlatformController extends Controller
{

    public function index()
    {
        $platform = Platform::all();
        return response()->json($platform);
    }

    public function toggle(Request $request, Platform $platform){

        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'status' => 'boolean'
        ]);

        $post = Auth::user()->posts()->findOrFail($request->post_id);

        //check if platform is already attached
        $isAttached = $post->platforms()->where('platform_id', $platform->id)->exists();
        $currentStatus = $isAttached
            ? $post->platforms()->find($platform->id)->pivot->platform_status
            : false;

        //determine new status
        $newStatus = $request->has('status')
            ? $request->status
            : !$currentStatus;

        //sync with new status
        $post->platforms()->syncWithoutDetaching([
            $platform->id => ['platform_status' => $newStatus]
        ]);

        return response()->json([
            'message' => 'Platform status updated',
            'platform_status' => $newStatus
        ]);
    }




}
