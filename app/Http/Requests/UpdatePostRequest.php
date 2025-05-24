<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'=> 'sometimes|string|max:255',
            'content'=> 'sometimes|string',
            'scheduled_time'=> [
                'nullable',
                'date',
                Rule::when(
                    $this->status !== 'published',
                    'after_or_equal:now'
                )
            ],
            'status' => [
                'sometimes',
                Rule::in(['draft', 'scheduled', 'published'])
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'scheduled_time.after_or_equal'=> 'Scheduled time must be in the future',
            'status.in'=> 'Status must be one of draft, scheduled or published'
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // If changing to published, set scheduled_time to now if not set
            if ($this->status === 'published' && !$this->scheduled_time) {
                $this->merge([
                    'scheduled_time' => now(),
                ]);
            }
            // Prevent changing published posts back to draft/scheduled
            if($this->post->status === 'published' && in_array($this->status, ['draft', 'scheduled'])){
                $validator->errors()->add('status', 'published posts cannot be changed back to draft or scheduled');
            }
        });
    }
}
