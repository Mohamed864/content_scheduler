## Scheduler - Full Stack Project

This is a full-stack project built with Laravel (backend) and React (frontend). It allows users to register, login, create scheduled posts across multiple platforms, and view analytics. The backend is powered by Laravel Sanctum for authentication and job queues for post scheduling. The frontend is implemented using React, React Router, Context API, Axios, and SASS.

# How to Run the Project

# Backend (Laravel)

# Step 1: Install Laravel and setup the project

composer create-project laravel/laravel scheduler
cd scheduler

# Step 2: Set your .env and configure PostgreSQL database

# Step 3: Install Laravel Sanctum

composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan migrate

php artisan install:api

# Step 4: Additional Configurations

-   Add `HasApiTokens` to `User.php`
-   Setup CORS and CSRF exemptions for `api/*`

# Step 5: Start the server

php artisan serve

# Backend Implementation Overview

# Part 1: Authentication (Register/Login/Logout)

Sanctum for API token authentication.

CORS setup and CSRF exemption.

AuthController with register, login, logout logic.

API routes in routes/api.php.

# Part 2: Posts Management

Post model, controller, migration, resource created.

CRUD with authentication middleware.

Custom route filterByStatusAndDate.

Scheduled posts are stored with user_id.

# Store Post Logic (Backend Example)

public function store(StorePostRequest $request) {
    $data = array_merge($request->validated(), ['user_id' => auth()->id()]);
$post = Post::create($data);
if ($request->has('platform_ids')) {
        $post->platforms()->attach($request->platform_ids, ['platform_status' => true]);
}
return response()->json($post->load('platforms'));
}

# Part 3: Platforms

Platform model, migration, controller created.

/api/platforms: get all platforms

/api/platforms/{platform}/toggle: toggle post-platform relation

# Part 4: Post-Platform Toggle Logic

Many-to-Many relation via platform_post pivot table

platform_status boolean status in pivot

Toggle implemented via toggle() in PlatformController

# Part 5: Scheduled Publishing via Jobs

PublishScheduledPosts command dispatches PublishPostJob

Automatically publishes posts with scheduled_time <= now()

Logs publishing success/failure
