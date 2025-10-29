import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function PaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const memberId = 'MEMBER_ID'; // Replace with actual member ID
      const response = await axios.get(`http://localhost:3000/api/member-payments/${memberId}`);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'requested': return '#FF9800';
      case 'disputed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const requestVerification = async (paymentId) => {
    try {
      await axios.post(`http://localhost:3000/api/payments/${paymentId}/verify`);
      fetchPayments(); // Refresh data
    } catch (error) {
      console.error('Error requesting verification:', error);
    }
  };

  const PaymentCard = ({ item }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.amount}>LKR {item.amount}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.verificationStatus) }]}>
          <Text style={styles.statusText}>{item.verificationStatus || 'unverified'}</Text>
        </View>
      </View>
      
      <Text style={styles.paymentDetail}>Date: {new Date(item.paymentDate).toLocaleDateString()}</Text>
      <Text style={styles.paymentDetail}>Type: {item.paymentType}</Text>
      <Text style={styles.paymentDetail}>Month: {item.paymentMonth}</Text>
      <Text style={styles.paymentDetail}>Class: {item.className}</Text>
      
      {(!item.verificationStatus || item.verificationStatus === 'unverified') && (
        <TouchableOpacity 
          style={styles.verifyButton}
          onPress={() => requestVerification(item._id)}
        >
          <Icon name="verified" size={16} color="white" />
          <Text style={styles.verifyButtonText}>Request Verify</Text>
        </TouchableOpacity>
      )}
      
      {item.verificationStatus === 'requested' && (
        <Text style={styles.pendingText}>Verification Pending</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      {payments.length > 0 ? (
        <FlatList
          data={payments}
          renderItem={({ item }) => <PaymentCard item={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="payment" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No payment records found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  paymentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  pendingText: {
    color: '#FF9800',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});