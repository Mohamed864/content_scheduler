<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class PublishPostJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Post $post) {}

    public function handle()
    {
        // Make sure to actually update the post
        $this->post->update([
            'status' => Post::STATUS_PUBLISHED,
            'scheduled_time' => now()
        ]);

        logger()->info("Post {$this->post->id} published successfully");
    }
}
