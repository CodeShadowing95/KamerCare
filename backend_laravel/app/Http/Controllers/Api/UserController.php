<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of all users (admin only)
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        // Vérifier si l'utilisateur est un admin
        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only admins can access users list.'
            ], 403);
        }

        $query = User::with('doctor');

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->get('role') !== 'all') {
            $query->where('role', $request->get('role'));
        }

        // Filter by status
        if ($request->has('status') && $request->get('status') !== 'all') {
            if ($request->get('status') === 'active') {
                $query->where('is_active', true);
            } elseif ($request->get('status') === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (in_array($sortBy, ['name', 'email', 'role', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $users = $query->paginate($request->get('per_page', 15));

        // Transform the data to include additional fields
        $transformedUsers = $users->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->is_active ? 'active' : 'inactive',
                'hospital' => $user->doctor ? ($user->doctor->hospital ?? '-') : '-',
                'certified' => $user->doctor ? ($user->doctor->is_certified === 'Yes') : false,
                'last_login' => $user->last_login_at ? $user->last_login_at->format('Y-m-d') : null,
                'created_at' => $user->created_at->format('Y-m-d'),
                'avatar' => '/placeholder-user.jpg'
            ];
        });

        // Rebuild pagination with transformed data
        $paginatedUsers = new \Illuminate\Pagination\LengthAwarePaginator(
            $transformedUsers,
            $users->total(),
            $users->perPage(),
            $users->currentPage(),
            [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $paginatedUsers,
            'message' => 'Users retrieved successfully'
        ]);
    }

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

    /**
     * Toggle doctor certification status
     */
    public function toggleCertification(Request $request, $userId): JsonResponse
    {
        $currentUser = auth()->user();
        
        // Vérifier si l'utilisateur est un admin
        if ($currentUser->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only admins can modify certification status.'
            ], 403);
        }

        $user = User::with('doctor')->find($userId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if ($user->role !== 'doctor' || !$user->doctor) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a doctor or doctor profile not found'
            ], 400);
        }

        // Toggle certification status
        $currentStatus = $user->doctor->is_certified;
        $newStatus = $currentStatus === 'Yes' ? 'No' : 'Yes';
        
        $user->doctor->update(['is_certified' => $newStatus]);

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'doctor_id' => $user->doctor->id,
                'previous_status' => $currentStatus,
                'new_status' => $newStatus,
                'certified' => $newStatus === 'Yes'
            ],
            'message' => $newStatus === 'Yes' 
                ? 'Doctor has been marked as certified' 
                : 'Doctor certification has been removed'
        ]);
    }
}