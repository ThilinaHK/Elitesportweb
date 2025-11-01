import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = 'https://elitesport.vercel.app/api';
  
  static Future<bool> login(String email, String phone) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': phone}),
      );

      print('Status: ${response.statusCode}');
      print('Body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Success field: ${data['success']}');
        print('Success type: ${data['success'].runtimeType}');
        
        if (data['success'] == true) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('memberId', data['member']['_id']);
          await prefs.setString('memberName', data['member']['fullName'] ?? '');
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Error: $e');
      return false;
    }
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('memberId') != null;
  }

  static Future<String?> getMemberId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('memberId');
  }

  static Future<String?> getMemberName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('memberName');
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}