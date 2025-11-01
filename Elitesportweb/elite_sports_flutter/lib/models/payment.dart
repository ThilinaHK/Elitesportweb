class Payment {
  final String id;
  final DateTime paymentDate;
  final double amount;
  final String paymentType;
  final String paymentMonth;
  final String className;
  final String? verificationStatus;

  Payment({
    required this.id,
    required this.paymentDate,
    required this.amount,
    required this.paymentType,
    required this.paymentMonth,
    required this.className,
    this.verificationStatus,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['_id'] ?? '',
      paymentDate: DateTime.tryParse(json['paymentDate'] ?? '') ?? DateTime.now(),
      amount: (json['amount'] ?? 0).toDouble(),
      paymentType: json['paymentType'] ?? '',
      paymentMonth: json['paymentMonth'] ?? '',
      className: json['className'] ?? '',
      verificationStatus: json['verificationStatus'],
    );
  }
}