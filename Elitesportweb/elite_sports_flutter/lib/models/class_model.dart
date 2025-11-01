class ClassModel {
  final String id;
  final String name;
  final String time;
  final String duration;
  final String instructor;
  final String type;

  ClassModel({
    required this.id,
    required this.name,
    required this.time,
    required this.duration,
    required this.instructor,
    required this.type,
  });

  factory ClassModel.fromJson(Map<String, dynamic> json) {
    return ClassModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      time: json['time'] ?? '',
      duration: json['duration'] ?? '',
      instructor: json['instructor'] ?? '',
      type: json['type'] ?? '',
    );
  }
}