import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/member.dart';
import '../models/class_model.dart';
import '../models/payment.dart';
import '../models/notification.dart';
import '../models/diet_plan.dart';
import '../models/exercise_plan.dart';

class ApiService {
  static const String baseUrl = 'https://elitesport.vercel.app/api';

  static Future<Member?> getMemberData(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/members/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Member.fromJson(data['member'] ?? data);
      }
    } catch (e) {
      print('Error fetching member data: $e');
      // Return mock data for demo
      return Member(
        id: memberId,
        memberId: 'ESA001',
        fullName: 'Demo Member',
        email: 'demo@example.com',
        phone: '+94 77 123 4567',
        joinDate: DateTime.now().subtract(Duration(days: 30)),
        dateOfBirth: DateTime(1990, 1, 1),
        gender: 'male',
        address: '123 Demo Street, Colombo',
        emergencyContact: '+94 77 987 6543',
      );
    }
    return null;
  }

  static Future<List<ClassModel>> getMemberClasses(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-classes/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['classes'] as List)
            .map((json) => ClassModel.fromJson(json))
            .toList();
      }
    } catch (e) {
      print('Error fetching classes: $e');
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
    return [];
  }

  static Future<List<Payment>> getMemberPayments(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-payments/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['payments'] as List)
            .map((json) => Payment.fromJson(json))
            .toList();
      }
    } catch (e) {
      print('Error fetching payments: $e');
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
    return [];
  }

  static Future<List<NotificationModel>> getMemberNotifications(String memberId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/member-notifications/$memberId'),
        headers: {'Accept': 'application/json'},
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return (data['notifications'] as List)
            .map((json) => NotificationModel.fromJson(json))
            .toList();
      }
    } catch (e) {
      print('Error fetching notifications: $e');
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
    return [];
  }

  static Future<DietPlan?> getMemberDietPlan(String memberId) async {
    try {
      print('Fetching diet plan for member: $memberId');
      final response = await http.get(Uri.parse('$baseUrl/member-diet/$memberId'));
      print('Diet API response status: ${response.statusCode}');
      print('Diet API response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final diets = data['diets'] as List;
        print('Found ${diets.length} diet plans');
        if (diets.isNotEmpty) {
          print('Creating DietPlan from: ${diets.first}');
          return DietPlan.fromJson(diets.first);
        }
      }
    } catch (e) {
      print('Error fetching diet plan: $e');
    }
    return null;
  }

  static Future<ExercisePlan?> getMemberExercisePlan(String memberId) async {
    try {
      print('Fetching exercise plan for member: $memberId');
      final response = await http.get(Uri.parse('$baseUrl/member-exercises/$memberId'));
      print('Exercise API response status: ${response.statusCode}');
      print('Exercise API response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final exercises = data['exercises'] as List;
        print('Found ${exercises.length} exercise plans');
        if (exercises.isNotEmpty) {
          print('Creating ExercisePlan from: ${exercises.first}');
          return ExercisePlan.fromJson(exercises.first);
        }
      }
    } catch (e) {
      print('Error fetching exercise plan: $e');
    }
    return null;
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
}