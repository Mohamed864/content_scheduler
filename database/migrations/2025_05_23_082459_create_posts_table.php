<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->nullable(false);
            $table->string('title');
            $table->text('content');
            $table->string('image_url')->nullable()->after('content');
            $table->timestamp('scheduled_time')->nullable();
            $table->enum('status',['draft','scheduled','published'])->default('draft');
            $table->timestamps();

            $table->index('status');
            $table->index('scheduled_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
