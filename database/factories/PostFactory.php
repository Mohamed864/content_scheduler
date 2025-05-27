<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $status = $this->faker->randomElement([
            Post::STATUS_DRAFT,
            Post::STATUS_SCHEDULED,
            Post::STATUS_PUBLISHED
        ]);

        return [
            'user_id' => User::factory(), // creates a user if none is passed
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraph,
            'scheduled_time' => $status === Post::STATUS_SCHEDULED
                ? Carbon::now()->addMinutes(rand(-30, 120))
                : null,
            'status' => $status,
        ];
    }
}
