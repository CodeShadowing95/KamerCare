<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Search users for appointment booking
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Query too short'
            ]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('phone', 'like', "%{$query}%");
        })
        ->where('role', 'patient') // Inclure uniquement les patients
        ->select('id', 'name', 'email', 'phone')
        ->limit(10)
        ->get()
        ->map(function ($user) {
            return [
                'id' => $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'display' => $user->name . ' - ' . $user->email . ' - ' . $user->phone
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $users,
            'message' => 'Users found successfully'
        ]);
    }
}