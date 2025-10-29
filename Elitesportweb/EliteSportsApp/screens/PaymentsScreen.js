import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function PaymentsScreen() {
  const payments = [
    { id: 1, amount: '$50', date: '2024-01-15', status: 'Paid', type: 'Monthly Fee' },
    { id: 2, amount: '$25', date: '2024-01-20', status: 'Pending', type: 'Personal Training' },
    { id: 3, amount: '$50', date: '2024-02-15', status: 'Overdue', type: 'Monthly Fee' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Payment Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Paid:</Text>
          <Text style={styles.summaryValue}>$150</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Pending:</Text>
          <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>$75</Text>
        </View>
      </View>

      {payments.map(payment => (
        <View key={payment.id} style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Text style={styles.paymentType}>{payment.type}</Text>
            <Text style={styles.paymentAmount}>{payment.amount}</Text>
          </View>
          <Text style={styles.paymentDate}>{payment.date}</Text>
          <View style={styles.paymentFooter}>
            <Text style={[styles.paymentStatus, { 
              color: payment.status === 'Paid' ? '#10b981' : payment.status === 'Overdue' ? '#ef4444' : '#f59e0b' 
            }]}>
              {payment.status}
            </Text>
            {payment.status !== 'Paid' && (
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20 },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 15 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#666' },
  summaryValue: { fontSize: 14, fontWeight: 'bold', color: '#1e3a8a' },
  paymentCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  paymentType: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  paymentAmount: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  paymentDate: { fontSize: 14, color: '#666', marginBottom: 15 },
  paymentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentStatus: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  payButton: { backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
  payButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});