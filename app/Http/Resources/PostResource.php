<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'scheduled_time' => $this->formatDate($this->scheduled_time),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'platforms' => $this->whenLoaded('platforms', function() {
                return $this->platforms->map(function($platform) {
                    return [
                        'id' => $platform->id,
                        'name' => $platform->name,
                        'type' => $platform->type,
                        'platform_status' => $platform->pivot->platform_status
                    ];
                });
            }),
            'user' => $this->whenLoaded('user', fn() => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ]),
            'links' => [
                'self' => route('posts.show', $this->id),
                'edit' => route('posts.update', $this->id),
            ]
        ];
    }

      private function formatDate($date)
    {
        return $date ? $date->format('Y-m-d H:i:s') : null;
    }

    //get values of stuts to be an additonal data for response
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'status_text' => $this->getStatusText(),
                'is_published' => $this->status === 'published',
                'is_scheduled' => $this->status === 'scheduled' && $this->scheduled_time > now(),
                'is_draft' => $this->status === 'draft',
            ]
        ];
    }

    //make status readable for the user
     protected function getStatusText(): string
    {
        return match($this->status) {
            'draft' => 'Draft (Not visible to public)',
            'scheduled' => 'Scheduled for publishing',
            'published' => 'Published and visible',
            default => 'Unknown status',
        };
    }
}
