<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FlightsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('flights')->delete();

        for ($i = 0; $i < 10; $i++) {
            DB::table('flights')->insert([
                //'id' => $i,
                'name' => 'Name ' . $i,
                'airline' => 'Airline ' . $i,
            ]);    
        }
    }
}
