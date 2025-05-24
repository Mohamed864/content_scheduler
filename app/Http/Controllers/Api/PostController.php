<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Post;
use Illuminate\Http\Request;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
     use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return  PostResource::collection(Post::where('user_id', Auth::id())
                ->latest()
                ->paginate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $post = Post::create($request->validated(),['user_id' => auth()->id()])->all();

            if ($request->has('platform_ids')) {
        $post->platforms()->attach($request->platform_ids, [
            'platform_status' => true
        ]);
    }

        return response()->json($post->load('platforms'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $this->authorize('view', $post);
        return new PostResource($post->load('platforms'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);
        $post->update($request->validated());
        return response()->json($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $this->authorize('destroy', $post);
        $post->delete();
        return response()->json(['message' => 'Post deleted successfully'],200);
    }

    public function publish(Post $post)
    {
        $this->authorize('update', $post);

        $post->update([
            'status' => Post::STATUS_PUBLISHED,
            'scheduled_time' => now() // This sets it to current timestamp
        ]);

        return new PostResource($post);
    }

    //test will appear in the front_end
    public function filterByStatusAndDate(Request $request)
    {
        $request->validate([
            'status' => 'nullable|string|in:draft,published',
            'date' => 'nullable|date'
        ]);

        $query = Post::where('user_id', Auth::id());

        if ($request->input('status')) {
            $query->where('status', $request->status);
        }

        if ($request->input('date')) {
            $query->where('scheduled_time', $request->date);
        }

        $posts = $query->latest()->paginate();

        return PostResource::collection($posts);


    }

}
