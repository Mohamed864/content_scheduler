<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Jobs\PublishPostJob;
use Carbon\Carbon;

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
        $time = $this->option('time') ? Carbon::parse($this->option('time')) : now();

        $query = Post::where('status', Post::STATUS_SCHEDULED)
                    ->where('scheduled_time', '<=', $time);

        if ($this->option('pretend')) {
            $posts = $query->get();

            if ($posts->isEmpty()) {
                $this->info('No scheduled posts to publish at '.$time);
                return;
            }

            $this->table(
                ['ID', 'Title', 'Scheduled Time'],
                $posts->map(function ($post) {
                    return [
                        $post->id,
                        $post->title,
                        $post->scheduled_time->format('Y-m-d H:i:s')
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
            dispatch(new PublishPostJob($post));
            $this->info('Dispatching job for post: '.$post->id.' - '.$post->title);
        });

        $this->info("Dispatched jobs for {$count} scheduled posts");
    }
}
