import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="fitness" size={30} color="#f36100" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="card" size={30} color="#4CAF50" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Payments</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="notifications" size={30} color="#FF9800" />
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Notifications</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>CrossFit class completed</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityText}>Payment processed</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
      </View>
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityText: {
    fontSize: 16,
    color: '#333',
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
  },
});