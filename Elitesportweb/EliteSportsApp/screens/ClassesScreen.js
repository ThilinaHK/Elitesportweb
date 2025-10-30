import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ClassesScreen() {
  const classes = [
    { id: 1, name: 'CrossFit', time: '08:00 AM', instructor: 'John Doe' },
    { id: 2, name: 'Karate', time: '10:00 AM', instructor: 'Jane Smith' },
    { id: 3, name: 'Zumba', time: '06:00 PM', instructor: 'Mike Johnson' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Classes</Text>
      </View>
      
      {classes.map(cls => (
        <View key={cls.id} style={styles.classCard}>
          <Text style={styles.className}>{cls.name}</Text>
          <Text style={styles.classTime}>{cls.time}</Text>
          <Text style={styles.classInstructor}>Instructor: {cls.instructor}</Text>
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
  classCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f36100',
    marginBottom: 5,
  },
  classTime: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  classInstructor: {
    fontSize: 14,
    color: '#666',
  },
});