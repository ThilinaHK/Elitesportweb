import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function ClassesScreen() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const memberId = 'MEMBER_ID'; // Replace with actual member ID
      const response = await axios.get(`http://localhost:3000/api/member-classes/${memberId}`);
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
    setLoading(false);
  };

  const ClassCard = ({ item }) => (
    <TouchableOpacity style={styles.classCard}>
      <View style={styles.classHeader}>
        <Text style={styles.className}>{item.name}</Text>
        <Icon name="fitness-center" size={24} color="#2196F3" />
      </View>
      <Text style={styles.classTime}>Time: {item.time}</Text>
      <Text style={styles.classDuration}>Duration: {item.duration}</Text>
      <Text style={styles.classInstructor}>Instructor: {item.instructor}</Text>
      <Text style={styles.classType}>Type: {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Classes</Text>
      {classes.length > 0 ? (
        <FlatList
          data={classes}
          renderItem={({ item }) => <ClassCard item={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="fitness-center" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No classes assigned yet</Text>
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
  classCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  classTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  classDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  classInstructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  classType: {
    fontSize: 14,
    color: '#666',
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