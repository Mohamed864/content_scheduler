<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Platform;
use App\Models\Post;

class AnalyticsController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();

        $platforms = Platform::all()->map(function ($platform) use ($user) {
            $posts = $platform->posts()->where('user_id', $user->id)->get();

            $publishedCount = $posts->where('status', 'published')->count();
            $scheduledCount = $posts->where('status', 'scheduled')->count();
            $totalCount = $posts->count();

            return [
                'id' => $platform->id,
                'name' => $platform->name,
                'posts_count' => $totalCount,
                'published_count' => $publishedCount,
                'scheduled_count' => $scheduledCount,
                'success_rate' => $totalCount > 0 ? round(($publishedCount / $totalCount) * 100, 2) : 0
            ];
        });

        $total_posts = $platforms->sum('posts_count');
        $total_published = $platforms->sum('published_count');
        $total_scheduled = $platforms->sum('scheduled_count');
        $overall_success_rate = $total_posts > 0 ? round(($total_published / $total_posts) * 100, 2) : 0;

        return response()->json([
            'platforms' => $platforms,
            'total_posts' => $total_posts,
            'total_published' => $total_published,
            'total_scheduled' => $total_scheduled,
            'overall_success_rate' => $overall_success_rate
        ]);
    }
}
