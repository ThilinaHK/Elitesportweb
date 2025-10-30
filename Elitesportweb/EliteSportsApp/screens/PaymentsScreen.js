import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function PaymentsScreen() {
  const payments = [
    { id: 1, amount: 5000, date: '2024-01-15', status: 'Paid' },
    { id: 2, amount: 5000, date: '2024-02-15', status: 'Paid' },
    { id: 3, amount: 5000, date: '2024-03-15', status: 'Pending' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
      </View>
      
      {payments.map(payment => (
        <View key={payment.id} style={styles.paymentCard}>
          <View style={styles.paymentInfo}>
            <Text style={styles.amount}>LKR {payment.amount}</Text>
            <Text style={styles.date}>{payment.date}</Text>
          </View>
          <View style={[styles.status, payment.status === 'Paid' ? styles.paid : styles.pending]}>
            <Text style={styles.statusText}>{payment.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  paid: {
    backgroundColor: '#4CAF50',
  },
  pending: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
});