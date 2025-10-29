import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ClassesScreen() {
  const classes = [
    { id: 1, name: 'CrossFit Morning', time: '7:00 AM', instructor: 'John Doe', status: 'Booked' },
    { id: 2, name: 'Karate Evening', time: '6:00 PM', instructor: 'Jane Smith', status: 'Available' },
    { id: 3, name: 'Zumba Dance', time: '5:00 PM', instructor: 'Mike Johnson', status: 'Full' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      
      {classes.map(cls => (
        <View key={cls.id} style={styles.classCard}>
          <View style={styles.classHeader}>
            <Text style={styles.className}>{cls.name}</Text>
            <Text style={[styles.status, { color: cls.status === 'Booked' ? '#10b981' : cls.status === 'Full' ? '#ef4444' : '#f59e0b' }]}>
              {cls.status}
            </Text>
          </View>
          <Text style={styles.classTime}>{cls.time}</Text>
          <Text style={styles.instructor}>Instructor: {cls.instructor}</Text>
          
          {cls.status === 'Available' && (
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Class</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e3a8a', marginBottom: 20 },
  classCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  classHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  className: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  status: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  classTime: { fontSize: 16, color: '#666', marginBottom: 4 },
  instructor: { fontSize: 14, color: '#666', marginBottom: 15 },
  bookButton: { backgroundColor: '#1e3a8a', padding: 12, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});