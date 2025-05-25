## Getting Started

## Frontend README file in content_scheduler_frontend

Follow these steps to run the project locally:

### Backend (Laravel)

## Instruction to run the backend part

1-

git clone https://github.com/Mohamed864/content_scheduler

cd your-repo

2-

composer install

3-

Setup your database in .env

4-

php artisan key:generate

5-

php artisan migrate --seed

6-

php artisan serve

/----------------------------------------------------------------/

### what did i do in the backend ?

## first part

# Step 1: Laravel Installation

# Install Laravel and set up your development environment:

composer create-project laravel/laravel resume-builder-api
cd resume-builder-api

Configure your database in the .env file. This project uses PostgreSQL.

# Run the migrations and start the development server:

php artisan migrate
php artisan serve

# Step 2: Sanctum Setup for API Authentication

# Install Laravel Sanctum:

composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan migrate

php artisan install:api

# Update your User model to use Sanctum:

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
use HasApiTokens, HasFactory, Notifiable;
}

# Step 3: Configure CORS

# To allow API access from the frontend:

php artisan vendor:publish --tag="cors"

# In config/cors.php, update:

'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,

# Also, update config/sanctum.php:

'stateful' => ['localhost:5173'],

# Step 4: CSRF Middleware Exclusion

# Create a custom middleware to exclude API routes from CSRF protection:

php artisan make:middleware VerifyCsrfToken

# Update the generated file:

protected $except = [
'api/*',
];

# Step 5: Auth Controller and Requests

# Generate the controller and request classes:

php artisan make:controller Api/AuthController
php artisan make:request LoginRequest
php artisan make:request RegisterRequest

Implement login, register, and logout methods in the AuthController.

Define the corresponding routes in routes/api.php.

## second part

# Post Management (CRUD)

# Step 6: Create Model, Migration, Controller, and Resource

# Run the following Artisan command:

php artisan make:model Post -mcr

# Explanation:

-m: Generates a migration file

-c: Generates a controller

-r: Makes the controller a resource controller with basic CRUD methods

# Step 7: Customize Post Model and Migration

Edit the generated migration file to define the schema for the posts table.

Edit the Post model to define relationships and fillable attributes.

# Then run:

php artisan migrate

# Step 8: Define Post Controller Logic

Update the PostController to implement the CRUD operations.

# Add two custom methods:

filterByStatusAndDate() – to filter posts based on their status and date.

publish() – to manually update post status to "published" for testing.

All methods in the controller are authenticated. Access requires a valid token returned from the login endpoint using Laravel Sanctum.

# Step 9: Register Routes

# In routes/api.php, use resource routes:

Route::apiResource('posts', PostController::class);
Route::get('/posts/filterByStatusAndDate', [PostController::class, 'filterByStatusAndDate']);

# hint : store function in PostController

# What it does:

Automatically associates the post with the currently authenticated user.

If platform_ids are provided, it attaches those platforms to the post with an active (true) platform_status.

# Token-Based Auth for All Routes

Each route is protected using Sanctum.

Tokens are generated after login and passed via headers (e.g., Authorization: Bearer <token>).

## third part

# Platform Management

# Model, Migration, Controller Setup

# To manage the platforms that posts can be published to, i created a Platform model with its migration and controller:

php artisan make:model Platform -m
php artisan make:controller Api/PlatformController

# After editing the migration file for the platforms table, run:

php artisan migrate

# Controller Logic: PlatformController.php

index() – Fetch all platforms

This endpoint returns a list of all platforms from the database.

toggle() – Toggle a platform's active status for a post
(Described in detail in Part 4)

# Routes

# The routes for platform management are registered in routes/api.php

Route::get('/platforms', [PlatformController::class, 'index']);
Route::post('/platforms/{platform}/toggle', [PlatformController::class, 'toggle']);

The index route is authenticated

The toggle route is authenticated, used to change a post's platform status on a specific platform.

## fourth part

# Toggle Platform Feature

To enable users to select which platforms a post should be published to, i established a many-to-many relationship between posts and platforms using a pivot table (platform_post). This pivot includes an extra column: platform_status to track whether the post is enabled for that platform.

# Database & Relationships

# Pivot Table: platform_post

Holds:
post_id, platform_id, platform_status (boolean)

# Model Relationships:

# In Post.php:

public function platforms()
{
return $this->belongsToMany(Platform::class)
->withPivot('platform_status')
->withTimestamps();
}

# In Platform.php:

public function posts()
{
return $this->belongsToMany(Post::class)
->withPivot('platform_status')
->withTimestamps();
}

# In User.php, to access the posts and platforms:

public function posts()
{
return $this->hasMany(Post::class);
}

public function platforms()
{
return $this->belongsToMany(Platform::class, 'platform_post')
->withPivot('platform_status')
->withTimestamps();
}

# Toggle Platform Logic

The PlatformController contains a toggle() method which allows an authenticated user to enable or disable a post for a specific platform. This supports both toggling and explicit status setting.

# Validation Rules:

/_$request->validate([
'post_id' => 'required|exists:posts,id',
'status' => 'boolean'
]);_/

# Authorization:

$post = Auth::user()->posts()->findOrFail($request->post_id);

# Status Toggling Logic:

$isAttached = $post->platforms()->where('platform_id', $platform->id)->exists();
$currentStatus = $isAttached
    ? $post->platforms()->find($platform->id)->pivot->platform_status
: false;

$newStatus = $request->has('status') ? $request->status : !$currentStatus;

$post->platforms()->syncWithoutDetaching([
$platform->id => ['platform_status' => $newStatus]
]);

## fifth part

# Scheduled Post Publishing with Job Dispatching

To automate the publishing of scheduled posts, i implemented a custom Laravel Artisan command and job dispatcher. This ensures posts with a scheduled_time are automatically published when their time comes.

# Artisan Command: posts:publish

Located in App\Console\Commands\PublishScheduledPosts.php

# Purpose:

# This command:

Checks for posts with status = scheduled and a scheduled_time that is due or past.

Publishes those posts immediately via a queued job (PublishPostJob).

Supports --pretend mode to simulate publishing.

Accepts a custom --time option for testing.

php artisan posts:publish --pretend
php artisan posts:publish --time="2025-06-01 12:00:00"

# Logic Summary:

$query = Post::with('platforms')
->where('status', Post::STATUS_SCHEDULED)
->where('scheduled_time', '<=', $time);

If --pretend is passed: it outputs the list of matching posts and their target platforms.

If not: it dispatches PublishPostJob for each post.

# Sample Output:

Dispatching job for post: 12 - Summer Campaign Post
Dispatched jobs for 3 scheduled posts

# Job Class: PublishPostJob

Located in App\Jobs\PublishPostJob.php

# This job:

Is queued and executed asynchronously.

Sets the post status to published.

Logs a success message.

# Logic:

$this->post->update([
'status' => Post::STATUS_PUBLISHED,
'scheduled_time' => now()
]);

logger()->info("Post {$this->post->id} published successfully");

# Enabling Job Processing

# Make sure to run the queue worker in your terminal to handle the scheduled jobs:

php artisan queue:work

# hint related to platform

php artisan make:seeder PlatformSeeder
create seeder in platform table
php artisan db:seed --class=PlatformSeeder

# hint related to relation between post and user

i created policy file to make crud function authorized for user
