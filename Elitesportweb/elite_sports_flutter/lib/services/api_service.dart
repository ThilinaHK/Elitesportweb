import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/member.dart';
import '../models/class_model.dart';
import '../models/payment.dart';
import '../models/notification.dart';
import '../models/diet_plan.dart';
import '../models/exercise_plan.dart';
import 'cors_proxy.dart';

class ApiService {
  static const String baseUrl = 'https://elitesport.vercel.app/api';

  static Future<Member?> getMemberData(String memberId) async {
    try {
      // First try to get member by ID
      var response = await http.get(
        Uri.parse('$baseUrl/members/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Member API Status: ${response.statusCode}');
      print('Member API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['member'] != null) {
          return Member.fromJson(data['member']);
        }
      }
      
      // If 404, try test endpoint to find member by email
      if (response.statusCode == 404) {
        response = await http.get(
          Uri.parse('$baseUrl/test-member'),
          headers: {'Accept': 'application/json'},
        );
        
        print('Test Member API Status: ${response.statusCode}');
        print('Test Member API Body: ${response.body}');
        
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (data['success'] == true && data['member'] != null) {
            return Member.fromJson(data['member']);
          }
        }
      }
    } catch (e) {
      print('Error fetching member data: $e');
    }
    
    // Return mock data for demo
    return Member(
      id: memberId,
      memberId: 'ESA4954513317',
      fullName: 'THK',
      email: 'thilina2u@gmail.com',
      phone: '0716800490',
      joinDate: DateTime.now().subtract(Duration(days: 30)),
      dateOfBirth: DateTime(1990, 1, 1),
      gender: 'male',
      address: '123 Demo Street, Colombo',
      emergencyContact: '+94 77 987 6543',
    );
  }

  static Future<List<ClassModel>> getMemberClasses(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-classes/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Classes API Status: ${response.statusCode}');
      print('Classes API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['classes'] != null) {
          return (data['classes'] as List)
              .map((json) => ClassModel.fromJson(json))
              .toList();
        }
      }
      
      // If 404, return empty list but don't show error
      if (response.statusCode == 404) {
        print('Member classes not found - returning mock data');
      }
    } catch (e) {
      print('Error fetching classes: $e');
    }
    
    // Return mock data for demo
    return [
      ClassModel(
        id: '1',
        name: 'CrossFit Training',
        time: '6:00 AM - 7:00 AM',
        duration: '1 Hour',
        instructor: 'John Doe',
        type: 'crossfit',
      ),
      ClassModel(
        id: '2',
        name: 'Karate Class',
        time: '7:00 PM - 8:00 PM',
        duration: '1 Hour',
        instructor: 'Jane Smith',
        type: 'karate',
      ),
    ];
  }

  static Future<List<Payment>> getMemberPayments(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-payments/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Payments API Status: ${response.statusCode}');
      print('Payments API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['payments'] != null) {
          return (data['payments'] as List)
              .map((json) => Payment.fromJson(json))
              .toList();
        }
      }
      
      // If 404, return empty list but don't show error
      if (response.statusCode == 404) {
        print('Member payments not found - returning mock data');
      }
    } catch (e) {
      print('Error fetching payments: $e');
    }
    
    // Return mock data for demo
    return [
      Payment(
        id: '1',
        paymentDate: DateTime.now().subtract(Duration(days: 15)),
        amount: 5000.0,
        paymentType: 'Monthly',
        paymentMonth: 'January 2024',
        className: 'CrossFit Training',
        verificationStatus: 'verified',
      ),
      Payment(
        id: '2',
        paymentDate: DateTime.now().subtract(Duration(days: 45)),
        amount: 4000.0,
        paymentType: 'Monthly',
        paymentMonth: 'December 2023',
        className: 'Karate Class',
        verificationStatus: 'pending',
      ),
    ];
  }

  static Future<List<NotificationModel>> getMemberNotifications(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-notifications/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Notifications API Status: ${response.statusCode}');
      print('Notifications API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['notifications'] != null) {
          return (data['notifications'] as List)
              .map((json) => NotificationModel.fromJson(json))
              .toList();
        }
      }
      
      // If 404, return empty list but don't show error
      if (response.statusCode == 404) {
        print('Member notifications not found - returning mock data');
      }
    } catch (e) {
      print('Error fetching notifications: $e');
    }
    
    // Return mock data for demo
    return [
      NotificationModel(
        id: '1',
        title: 'Class Reminder',
        message: 'Your CrossFit class starts in 30 minutes',
        className: 'CrossFit Training',
        createdAt: DateTime.now().subtract(Duration(hours: 1)),
      ),
      NotificationModel(
        id: '2',
        title: 'Payment Due',
        message: 'February payment is due in 3 days',
        className: 'Karate Class',
        createdAt: DateTime.now().subtract(Duration(days: 1)),
      ),
    ];
  }

  static Future<DietPlan?> getMemberDietPlan(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-diet/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Diet API Status: ${response.statusCode}');
      print('Diet API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['diets'] != null) {
          final diets = data['diets'] as List;
          if (diets.isNotEmpty) {
            return DietPlan.fromJson(diets.first);
          }
        }
      }
    } catch (e) {
      print('Error fetching diet plan: $e');
    }
    
    // Return mock data for demo
    return DietPlan(
      id: '1',
      planName: 'Healthy Weight Loss Plan',
      description: 'A balanced diet plan for healthy weight management',
      assignedBy: 'Nutritionist Sarah',
      calories: '1800',
      duration: '4 weeks',
      notes: 'Drink plenty of water and avoid processed foods',
      meals: [
        Meal(
          name: 'Breakfast',
          time: '7:00 AM',
          foods: ['Oatmeal with fruits', 'Green tea', 'Almonds'],
        ),
        Meal(
          name: 'Lunch',
          time: '12:30 PM',
          foods: ['Grilled chicken salad', 'Brown rice', 'Vegetables'],
        ),
        Meal(
          name: 'Dinner',
          time: '7:00 PM',
          foods: ['Fish curry', 'Quinoa', 'Steamed broccoli'],
        ),
      ],
    );
  }

  static Future<ExercisePlan?> getMemberExercisePlan(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-exercises/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      
      print('Exercise API Status: ${response.statusCode}');
      print('Exercise API Body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['exercises'] != null) {
          final exercises = data['exercises'] as List;
          if (exercises.isNotEmpty) {
            return ExercisePlan.fromJson(exercises.first);
          }
        }
      }
    } catch (e) {
      print('Error fetching exercise plan: $e');
    }
    
    // Return mock data for demo
    return ExercisePlan(
      id: '1',
      planName: 'Beginner Strength Training',
      description: 'A comprehensive workout plan for building strength',
      assignedBy: 'Trainer Mike',
      duration: '6 weeks',
      notes: 'Focus on proper form and gradually increase weights',
      exercises: [
        Exercise(
          name: 'Push-ups',
          sets: '3',
          reps: '15',
          instructions: 'Keep your body straight and lower chest to ground',
        ),
        Exercise(
          name: 'Squats',
          sets: '3',
          reps: '20',
          instructions: 'Keep feet shoulder-width apart, lower until thighs parallel',
        ),
        Exercise(
          name: 'Deadlifts',
          sets: '3',
          reps: '12',
          weight: '40kg',
          instructions: 'Keep back straight, lift with legs and hips',
        ),
      ],
    );
  }

  static Future<bool> updateMemberProfile(String memberId, Map<String, dynamic> data) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/members/$memberId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(data),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error updating profile: $e');
      return false;
    }
  }

  static Future<bool> requestPaymentVerification(String paymentId) async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/payments/$paymentId/verify'));
      return response.statusCode == 200;
    } catch (e) {
      print('Error requesting verification: $e');
      return false;
    }
  }

  static Future<bool> registerMember(Map<String, dynamic> memberData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/members'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(memberData),
      );
      print('Registration response: ${response.statusCode} - ${response.body}');
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error registering member: $e');
      return false;
    }
  }

  static Future<List<Map<String, String>>> getVideos() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/videos'),
        headers: {'Accept': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['videos'] != null) {
          return (data['videos'] as List)
              .map((video) => {
                    'title': video['title']?.toString() ?? '',
                    'duration': video['duration']?.toString() ?? '',
                    'instructor': video['instructor']?.toString() ?? '',
                    'description': video['description']?.toString() ?? '',
                    'url': video['url']?.toString() ?? '',
                  })
              .toList();
        }
      }
    } catch (e) {
      print('Error fetching videos: $e');
    }
    return [];
  }

  static Future<List<Map<String, String>>> getArticles() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/articles'),
        headers: {'Accept': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true && data['articles'] != null) {
          return (data['articles'] as List)
              .map((article) => {
                    'title': article['title']?.toString() ?? '',
                    'author': article['author']?.toString() ?? '',
                    'readTime': article['readTime']?.toString() ?? '',
                    'category': article['category']?.toString() ?? '',
                    'excerpt': article['excerpt']?.toString() ?? '',
                    'date': article['date']?.toString() ?? '',
                    'content': article['content']?.toString() ?? '',
                  })
              .toList();
        }
      }
    } catch (e) {
      print('Error fetching articles: $e');
    }
    return [];
  }
}