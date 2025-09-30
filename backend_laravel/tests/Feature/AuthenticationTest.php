<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test d'inscription d'un utilisateur
     */
    public function test_user_can_register()
    {
        $userData = [
            'firstName' => 'John',
            'lastName' => 'Doe',
            'email' => 'register@example.com', // Email unique pour ce test
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'patient',
            'phone' => '+237123456789',
            'dateOfBirth' => '1990-01-01',
            'gender' => 'male',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'role',
                            'phone',
                        ],
                        'token'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'register@example.com',
            'name' => 'John Doe',
            'role' => 'patient',
        ]);
    }

    /**
     * Test de connexion d'un utilisateur
     */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'login@example.com', // Email unique pour ce test
            'password' => Hash::make('password123'),
        ]);

        $loginData = [
            'email' => 'login@example.com',
            'password' => 'password123',
        ];

        $response = $this->postJson('/api/login', $loginData);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'role',
                        ],
                        'token'
                    ]
                ]);
    }

    /**
     * Test de connexion avec des identifiants incorrects
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test2@example.com', // Email différent pour éviter les conflits
            'password' => Hash::make('password123'),
        ]);

        $loginData = [
            'email' => 'test2@example.com',
            'password' => 'wrongpassword',
        ];

        $response = $this->postJson('/api/login', $loginData);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ]);
    }

    /**
     * Test d'accès à une route protégée
     */
    public function test_authenticated_user_can_access_protected_route()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/me');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'role',
                        ]
                    ]
                ])
                ->assertJson([
                    'success' => true
                ]);
    }

    /**
     * Test d'accès refusé sans token
     */
    public function test_unauthenticated_user_cannot_access_protected_route()
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    /**
     * Test de déconnexion
     */
    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'message' => 'Logout successful'
                ]);

        // Vérifier que le token a été révoqué
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }
}