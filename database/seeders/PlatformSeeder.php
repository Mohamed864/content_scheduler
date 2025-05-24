<?php

namespace Database\Seeders;

use App\Models\Platform;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $platforms = [
            ['name'=>'Twitter', 'type'=>'twitter'],
            ['name'=>'Facebook', 'type'=>'facebook'],
            ['name'=>'Instagram', 'type'=>'instagram'],
            ['name' => 'LinkedIn', 'type' => 'linkedin'],
            ['name' => 'Pinterest', 'type' => 'pinterest'],
            ['name' => 'Reddit', 'type' => 'reddit'],
            ['name' => 'Tumblr', 'type' => 'tumblr'],
        ];

        foreach ($platforms as $platform)
        {
            Platform::updateOrCreate(
                ['type' => $platform['type']],
                ['name' => $platform['name']]
            );
        }
    }
}
