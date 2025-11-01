import 'dart:convert';
import 'package:http/http.dart' as http;

class CorsProxy {
  static const String proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  static const String baseUrl = 'https://elitesport.vercel.app/api';
  
  static Future<http.Response> get(String endpoint) async {
    try {
      // Try direct call first
      final directResponse = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );
      
      if (directResponse.statusCode == 200) {
        return directResponse;
      }
    } catch (e) {
      print('Direct call failed: $e');
    }
    
    // Fallback to CORS proxy
    try {
      return await http.get(
        Uri.parse('$proxyUrl$baseUrl$endpoint'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      );
    } catch (e) {
      print('Proxy call failed: $e');
      throw e;
    }
  }
  
  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    try {
      // Try direct call first
      final directResponse = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );
      
      if (directResponse.statusCode == 200) {
        return directResponse;
      }
    } catch (e) {
      print('Direct POST failed: $e');
    }
    
    // Fallback to CORS proxy
    try {
      return await http.post(
        Uri.parse('$proxyUrl$baseUrl$endpoint'),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: jsonEncode(body),
      );
    } catch (e) {
      print('Proxy POST failed: $e');
      throw e;
    }
  }
}