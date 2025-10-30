import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function NotificationsScreen() {
  const notifications = [
    { id: 1, title: 'Class Reminder', message: 'CrossFit class starts in 1 hour', time: '1h ago' },
    { id: 2, title: 'Payment Due', message: 'Monthly payment due tomorrow', time: '2h ago' },
    { id: 3, title: 'New Class Available', message: 'Yoga class added to schedule', time: '1d ago' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
      </View>
      
      {notifications.map(notification => (
        <View key={notification.id} style={styles.notificationCard}>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </View>
          <Text style={styles.notificationTime}>{notification.time}</Text>
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
  notificationCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-start',
  },
});