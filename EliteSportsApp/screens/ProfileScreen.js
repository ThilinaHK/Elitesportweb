import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const [member, setMember] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const memberId = 'MEMBER_ID'; // Replace with actual member ID
      const response = await axios.get(`http://localhost:3000/api/members/${memberId}`);
      setMember(response.data.member);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const startEdit = () => {
    setEditData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      emergencyContact: member.emergencyContact,
      medicalConditions: member.medicalConditions || ''
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    try {
      await axios.put(`http://localhost:3000/api/members/${member._id}`, editData);
      setMember({ ...member, ...editData });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  if (!member) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Icon name="person" size={50} color="white" />
        </View>
        <Text style={styles.memberName}>{member.fullName}</Text>
        <Text style={styles.memberId}>ID: {member.memberId}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {!editing ? (
            <TouchableOpacity onPress={startEdit} style={styles.editButton}>
              <Icon name="edit" size={20} color="#2196F3" />
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
                <Icon name="check" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)} style={styles.cancelButton}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {editing ? (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={editData.fullName}
              onChangeText={(text) => setEditData({ ...editData, fullName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editData.email}
              onChangeText={(text) => setEditData({ ...editData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={editData.phone}
              onChangeText={(text) => setEditData({ ...editData, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={editData.address}
              onChangeText={(text) => setEditData({ ...editData, address: text })}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Contact"
              value={editData.emergencyContact}
              onChangeText={(text) => setEditData({ ...editData, emergencyContact: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Medical Conditions"
              value={editData.medicalConditions}
              onChangeText={(text) => setEditData({ ...editData, medicalConditions: text })}
              multiline
            />
          </View>
        ) : (
          <View>
            <Text style={styles.infoText}>Email: {member.email}</Text>
            <Text style={styles.infoText}>Phone: {member.phone}</Text>
            <Text style={styles.infoText}>Address: {member.address}</Text>
            <Text style={styles.infoText}>Emergency Contact: {member.emergencyContact}</Text>
            <Text style={styles.infoText}>Medical Conditions: {member.medicalConditions || 'None'}</Text>
            <Text style={styles.infoText}>Member Since: {new Date(member.joinDate).toLocaleDateString()}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Icon name="logout" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  memberName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  memberId: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 5,
  },
  editActions: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});