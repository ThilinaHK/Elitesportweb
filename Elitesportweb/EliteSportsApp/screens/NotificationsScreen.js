import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function NotificationsScreen() {
  const notifications = [
    { id: 1, title: 'Payment Reminder', message: 'Your monthly fee is due in 3 days', time: '2 hours ago', priority: 'high' },
    { id: 2, title: 'Class Update', message: 'CrossFit class moved to 8:00 AM tomorrow', time: '5 hours ago', priority: 'medium' },
    { id: 3, title: 'New Event', message: 'Special Zumba workshop this weekend', time: '1 day ago', priority: 'low' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      
      {notifications.map(notification => (
        <View key={notification.id} style={[styles.notificationCard, {
          borderLeftColor: notification.priority === 'high' ? '#ef4444' : notification.priority === 'medium' ? '#f59e0b' : '#10b981'
        }]}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <View style={[styles.priorityBadge, {
            backgroundColor: notification.priority === 'high' ? '#fef2f2' : notification.priority === 'medium' ? '#fffbeb' : '#f0fdf4'
          }]}>
            <Text style={[styles.priorityText, {
              color: notification.priority === 'high' ? '#ef4444' : notification.priority === 'medium' ? '#f59e0b' : '#10b981'
            }]}>
              {notification.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20 },
  notificationCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e3a8a' },
  notificationTime: { fontSize: 12, color: '#666' },
  notificationMessage: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
  priorityBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priorityText: { fontSize: 10, fontWeight: 'bold' }
});