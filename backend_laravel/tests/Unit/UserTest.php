<?php

namespace Tests\Unit;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de création d'un utilisateur
     */
    public function test_user_can_be_created()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
            'role' => 'patient',
            'phone' => '+237123456789',
            'is_active' => true,
        ];

        $user = User::create($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertEquals('patient', $user->role);
        $this->assertTrue($user->is_active);
    }

    /**
     * Test des attributs cachés
     */
    public function test_user_hidden_attributes()
    {
        $user = User::factory()->create();
        $userArray = $user->toArray();

        $this->assertArrayNotHasKey('password', $userArray);
        $this->assertArrayNotHasKey('remember_token', $userArray);
    }

    /**
     * Test des attributs fillable
     */
    public function test_user_fillable_attributes()
    {
        $fillable = [
            'name',
            'email',
            'password',
            'role',
            'phone',
            'is_active',
        ];

        $user = new User();
        $this->assertEquals($fillable, $user->getFillable());
    }

    /**
     * Test du cast boolean pour is_active
     */
    public function test_is_active_cast_to_boolean()
    {
        $user = User::factory()->create(['is_active' => 1]);
        $this->assertIsBool($user->is_active);
        $this->assertTrue($user->is_active);

        $user = User::factory()->create(['is_active' => 0]);
        $this->assertIsBool($user->is_active);
        $this->assertFalse($user->is_active);
    }

    /**
     * Test de validation email unique
     */
    public function test_user_email_must_be_unique()
    {
        User::factory()->create(['email' => 'test@example.com']);

        $this->expectException(\Illuminate\Database\QueryException::class);
        User::factory()->create(['email' => 'test@example.com']);
    }
}