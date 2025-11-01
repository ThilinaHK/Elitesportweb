class ExercisePlan {
  final String id;
  final String planName;
  final String description;
  final String assignedBy;
  final String? duration;
  final String? notes;
  final List<Exercise> exercises;

  ExercisePlan({
    required this.id,
    required this.planName,
    required this.description,
    required this.assignedBy,
    this.duration,
    this.notes,
    required this.exercises,
  });

  factory ExercisePlan.fromJson(Map<String, dynamic> json) {
    return ExercisePlan(
      id: json['_id'] ?? '',
      planName: json['planName'] ?? '',
      description: json['description'] ?? '',
      assignedBy: json['assignedBy'] ?? '',
      duration: json['duration'],
      notes: json['notes'],
      exercises: (json['exercises'] as List? ?? [])
          .map((exercise) => Exercise.fromJson(exercise))
          .toList(),
    );
  }
}

class Exercise {
  final String name;
  final String sets;
  final String reps;
  final String? weight;
  final String? duration;
  final String? instructions;

  Exercise({
    required this.name,
    required this.sets,
    required this.reps,
    this.weight,
    this.duration,
    this.instructions,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      name: json['name'] ?? '',
      sets: json['sets'] ?? '',
      reps: json['reps'] ?? '',
      weight: json['weight'],
      duration: json['duration'],
      instructions: json['instructions'],
    );
  }
}