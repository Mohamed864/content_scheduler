<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'scheduled_time' => 'nullable|date|after_or_equal:now',
            'status' => [
                'required',
                Rule::in(['draft', 'scheduled', 'published']),
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'scheduled_time.after_or_equal' => 'Scheduled time must be in the future',
            'status.in' => 'Status must be one of draft, scheduled or published'
        ];
    }

    protected function prepareForValidation(): void
    {
        //automatically set user_id to current user
        $this->merge([
            'user_id' => auth()->id()
        ]);

        //if status is published , set scheduled_time to now
        if ($this->status === 'published') {
            $this->merge([
                'scheduled_time' => now(),
            ]);
        }
    }

    // Add this method to ensure user_id is included in validated data for test
public function validated($key = null, $default = null)
{
    return array_merge(
        parent::validated($key, $default),
        ['user_id' => auth()->id()]
    );
}
}
