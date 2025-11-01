class Member {
  final String id;
  final String memberId;
  final String fullName;
  final String email;
  final String phone;
  final DateTime joinDate;
  final DateTime dateOfBirth;
  final String gender;
  final String address;
  final String emergencyContact;
  final String? medicalConditions;
  final String? profilePicture;

  Member({
    required this.id,
    required this.memberId,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.joinDate,
    required this.dateOfBirth,
    required this.gender,
    required this.address,
    required this.emergencyContact,
    this.medicalConditions,
    this.profilePicture,
  });

  factory Member.fromJson(Map<String, dynamic> json) {
    return Member(
      id: json['_id'] ?? '',
      memberId: json['memberId'] ?? '',
      fullName: json['fullName'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      joinDate: DateTime.tryParse(json['joinDate'] ?? '') ?? DateTime.now(),
      dateOfBirth: DateTime.tryParse(json['dateOfBirth'] ?? '') ?? DateTime.now(),
      gender: json['gender'] ?? '',
      address: json['address'] ?? '',
      emergencyContact: json['emergencyContact'] ?? '',
      medicalConditions: json['medicalConditions'],
      profilePicture: json['profilePicture'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'memberId': memberId,
      'fullName': fullName,
      'email': email,
      'phone': phone,
      'joinDate': joinDate.toIso8601String(),
      'dateOfBirth': dateOfBirth.toIso8601String(),
      'gender': gender,
      'address': address,
      'emergencyContact': emergencyContact,
      'medicalConditions': medicalConditions,
      'profilePicture': profilePicture,
    };
  }
}