import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class QRScannerScreen extends StatefulWidget {
  @override
  _QRScannerScreenState createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  MobileScannerController cameraController = MobileScannerController();
  String? memberId;
  String? memberName;
  String message = '';
  bool isLoading = false;
  bool isScanning = true;

  @override
  void initState() {
    super.initState();
    _loadMemberData();
  }

  _loadMemberData() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    setState(() {
      memberId = prefs.getString('memberId');
      memberName = prefs.getString('memberName');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('QR Scanner'),
        backgroundColor: Colors.blue[800],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.flash_on),
            onPressed: () => cameraController.toggleTorch(),
          ),
        ],
      ),
      body: memberId == null ? _buildLoginView() : _buildScannerView(),
    );
  }

  Widget _buildLoginView() {
    TextEditingController idController = TextEditingController();
    
    return Padding(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.person, size: 80, color: Colors.blue[800]),
          SizedBox(height: 20),
          Text('Login Required', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          SizedBox(height: 20),
          TextField(
            controller: idController,
            decoration: InputDecoration(
              labelText: 'Member ID',
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.badge),
            ),
          ),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => _login(idController.text),
            child: Text('Login'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[800],
              foregroundColor: Colors.white,
              minimumSize: Size(double.infinity, 50),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScannerView() {
    return Column(
      children: [
        if (memberName != null)
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(16),
            color: Colors.green[100],
            child: Text(
              'Welcome, $memberName!',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green[800]),
            ),
          ),
        Expanded(
          flex: 3,
          child: Stack(
            children: [
              MobileScanner(
                controller: cameraController,
                onDetect: (capture) {
                  if (isScanning && !isLoading) {
                    final List<Barcode> barcodes = capture.barcodes;
                    for (final barcode in barcodes) {
                      if (barcode.rawValue != null) {
                        _markAttendance(barcode.rawValue!);
                        break;
                      }
                    }
                  }
                },
              ),
              Center(
                child: Container(
                  width: 250,
                  height: 250,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.blue, width: 3),
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
        Container(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              if (isLoading)
                CircularProgressIndicator()
              else if (message.isNotEmpty)
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: message.contains('Success') ? Colors.green[100] : Colors.red[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    message,
                    style: TextStyle(
                      color: message.contains('Success') ? Colors.green[800] : Colors.red[800],
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              SizedBox(height: 15),
              Text(
                'Point camera at QR code to automatically mark attendance',
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 15),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          isScanning = !isScanning;
                        });
                      },
                      child: Text(isScanning ? 'Pause Scanning' : 'Resume Scanning'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: isScanning ? Colors.orange : Colors.green,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                  SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _logout,
                      child: Text('Logout'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  _login(String id) async {
    if (id.isEmpty) return;
    
    try {
      final response = await http.get(
        Uri.parse('http://localhost:3001/api/members/$id'),
      );
      
      if (response.statusCode == 200) {
        final member = json.decode(response.body);
        SharedPreferences prefs = await SharedPreferences.getInstance();
        await prefs.setString('memberId', id);
        await prefs.setString('memberName', member['fullName']);
        
        setState(() {
          memberId = id;
          memberName = member['fullName'];
        });
      } else {
        _showSnackBar('Invalid Member ID');
      }
    } catch (e) {
      _showSnackBar('Login failed. Check connection.');
    }
  }

  _markAttendance(String qrData) async {
    setState(() {
      isLoading = true;
      isScanning = false;
      message = '';
    });

    try {
      final response = await http.post(
        Uri.parse('http://localhost:3001/api/attendance/mark'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'classId': qrData,
          'memberId': memberId,
          'status': 'Present',
          'markedBy': 'Member',
          'markedById': memberId,
        }),
      );

      final data = json.decode(response.body);
      
      setState(() {
        isLoading = false;
        if (response.statusCode == 200) {
          message = '✅ Success! Attendance marked as PRESENT';
        } else {
          message = '❌ Error: ${data['error']}';
        }
      });

      // Auto resume scanning after 3 seconds
      Future.delayed(Duration(seconds: 3), () {
        if (mounted) {
          setState(() {
            message = '';
            isScanning = true;
          });
        }
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        message = '❌ Network error. Please try again.';
        isScanning = true;
      });
    }
  }

  _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    setState(() {
      memberId = null;
      memberName = null;
      message = '';
    });
  }

  _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }
}