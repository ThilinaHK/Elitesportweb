class DietPlan {
  final String id;
  final String planName;
  final String description;
  final String assignedBy;
  final String? calories;
  final String? duration;
  final String? notes;
  final List<Meal> meals;

  DietPlan({
    required this.id,
    required this.planName,
    required this.description,
    required this.assignedBy,
    this.calories,
    this.duration,
    this.notes,
    required this.meals,
  });

  factory DietPlan.fromJson(Map<String, dynamic> json) {
    return DietPlan(
      id: json['_id'] ?? '',
      planName: json['planName'] ?? '',
      description: json['description'] ?? '',
      assignedBy: json['assignedBy'] ?? 'Instructor',
      calories: json['calories']?.toString(),
      duration: json['duration']?.toString(),
      notes: json['notes'],
      meals: (json['meals'] as List? ?? [])
          .map((meal) => Meal.fromJson(meal))
          .toList(),
    );
  }
}

class Meal {
  final String name;
  final String? time;
  final List<String> foods;

  Meal({
    required this.name,
    this.time,
    required this.foods,
  });

  factory Meal.fromJson(Map<String, dynamic> json) {
    return Meal(
      name: json['name'] ?? '',
      time: json['time'],
      foods: List<String>.from(json['foods'] ?? []),
    );
  }
}