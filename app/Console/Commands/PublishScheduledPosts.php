<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Jobs\PublishPostJob;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PublishScheduledPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:publish
                            {--pretend : Display what would be published without actually doing it}
                            {--time= : Specify a custom time to check against (format: Y-m-d H:i:s)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish scheduled posts that are due';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Starting scheduled posts publication', ['time' => now()]);

        $time = $this->option('time') ? Carbon::parse($this->option('time')) : now();
        Log::debug('Checking posts scheduled before', ['check_time' => $time]);

        $query = Post::with('platforms')
                  ->where('status', Post::STATUS_SCHEDULED)
                  ->where('scheduled_time', '<=', $time);

        if ($this->option('pretend')) {
            $posts = $query->get();

            if ($posts->isEmpty()) {
                $this->info('No scheduled posts to publish at '.$time);
                return;
            }

            $this->table(
                ['ID', 'Title', 'Scheduled Time', 'Platforms'],
                $posts->map(function ($post) {
                    return [
                        $post->id,
                        $post->title,
                        $post->scheduled_time->format('Y-m-d H:i:s'),
                        $post->platforms->pluck('name')->join(', ')
                    ];
                })
            );

            $this->info(count($posts).' posts would be published at '.$time);
            return;
        }

        $count = $query->count();

        if ($count === 0) {
            $this->info('No scheduled posts to publish at '.$time);
            return;
        }

        $query->each(function ($post) {
            try {
                dispatch(new PublishPostJob($post));
                $this->info('Dispatching job for post: '.$post->id.' - '.$post->title);
                Log::info('Dispatched publish job', ['post_id' => $post->id]);
            } catch (\Exception $e) {
                Log::error('Failed to dispatch job for post', [
                    'post_id' => $post->id,
                    'error' => $e->getMessage()
                ]);
                $this->error('Error dispatching job for post '.$post->id.': '.$e->getMessage());
            }
        });

        $this->info("Dispatched jobs for {$count} scheduled posts");
        Log::info('Completed scheduled posts publication', [
            'count' => $count,
            'time' => now()
        ]);
    }
}
