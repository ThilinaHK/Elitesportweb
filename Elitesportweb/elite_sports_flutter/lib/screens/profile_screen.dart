import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/member.dart';
import '../services/api_service.dart';

class ProfileScreen extends StatefulWidget {
  final Member? member;
  final VoidCallback onUpdate;

  const ProfileScreen({
    super.key,
    required this.member,
    required this.onUpdate,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _isEditing = false;
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _phoneController;
  late TextEditingController _addressController;
  late TextEditingController _emergencyContactController;
  late TextEditingController _medicalConditionsController;

  @override
  void initState() {
    super.initState();
    _initializeControllers();
  }

  void _initializeControllers() {
    _nameController = TextEditingController(text: widget.member?.fullName ?? '');
    _emailController = TextEditingController(text: widget.member?.email ?? '');
    _phoneController = TextEditingController(text: widget.member?.phone ?? '');
    _addressController = TextEditingController(text: widget.member?.address ?? '');
    _emergencyContactController = TextEditingController(text: widget.member?.emergencyContact ?? '');
    _medicalConditionsController = TextEditingController(text: widget.member?.medicalConditions ?? '');
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    final data = {
      'fullName': _nameController.text,
      'email': _emailController.text,
      'phone': _phoneController.text,
      'address': _addressController.text,
      'emergencyContact': _emergencyContactController.text,
      'medicalConditions': _medicalConditionsController.text,
    };

    final success = await ApiService.updateMemberProfile(widget.member!.id, data);

    if (success) {
      setState(() => _isEditing = false);
      widget.onUpdate();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to update profile'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Widget _buildInfoCard(String title, String value, IconData icon) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF1e3c72).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: const Color(0xFF1e3c72), size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value.isEmpty ? 'Not provided' : value,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEditField(String label, TextEditingController controller, IconData icon, {int maxLines = 1}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: TextFormField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          filled: true,
          fillColor: Colors.grey.shade50,
        ),
        validator: (value) {
          if (label.contains('Name') || label.contains('Email') || label.contains('Phone')) {
            if (value == null || value.isEmpty) {
              return 'This field is required';
            }
          }
          if (label.contains('Email') && value != null && value.isNotEmpty) {
            if (!value.contains('@')) {
              return 'Please enter a valid email';
            }
          }
          return null;
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.member == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: const Color(0xFF1e3c72),
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          if (!_isEditing)
            IconButton(
              onPressed: () => setState(() => _isEditing = true),
              icon: const Icon(Icons.edit),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Profile Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF1e3c72), Color(0xFF2a5298)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundColor: Colors.white.withOpacity(0.2),
                    child: const Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    widget.member!.fullName,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Member ID: ${widget.member!.memberId}',
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            if (!_isEditing) ...[
              // View Mode
              _buildInfoCard('Full Name', widget.member!.fullName, Icons.person),
              _buildInfoCard('Email', widget.member!.email, Icons.email),
              _buildInfoCard('Phone', widget.member!.phone, Icons.phone),
              _buildInfoCard('Date of Birth', DateFormat('MMM dd, yyyy').format(widget.member!.dateOfBirth), Icons.cake),
              _buildInfoCard('Gender', widget.member!.gender, Icons.wc),
              _buildInfoCard('Address', widget.member!.address, Icons.location_on),
              _buildInfoCard('Emergency Contact', widget.member!.emergencyContact, Icons.emergency),
              _buildInfoCard('Medical Conditions', widget.member!.medicalConditions ?? 'None reported', Icons.medical_services),
              _buildInfoCard('Member Since', DateFormat('MMM dd, yyyy').format(widget.member!.joinDate), Icons.calendar_today),
            ] else ...[
              // Edit Mode
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildEditField('Full Name', _nameController, Icons.person),
                    _buildEditField('Email', _emailController, Icons.email),
                    _buildEditField('Phone', _phoneController, Icons.phone),
                    _buildEditField('Address', _addressController, Icons.location_on, maxLines: 3),
                    _buildEditField('Emergency Contact', _emergencyContactController, Icons.emergency),
                    _buildEditField('Medical Conditions', _medicalConditionsController, Icons.medical_services, maxLines: 3),
                    const SizedBox(height: 24),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: _saveProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('Save Changes'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() => _isEditing = false);
                              _initializeControllers();
                            },
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('Cancel'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    _emergencyContactController.dispose();
    _medicalConditionsController.dispose();
    super.dispose();
  }
}