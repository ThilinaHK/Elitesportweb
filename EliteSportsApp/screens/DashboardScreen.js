import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function DashboardScreen() {
  const [member, setMember] = useState(null);
  const [stats, setStats] = useState({
    classes: 0,
    payments: 0,
    notifications: 0,
    events: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Replace with actual member ID from storage
      const memberId = 'MEMBER_ID';
      
      const [memberRes, classesRes, paymentsRes, notificationsRes, eventsRes] = await Promise.all([
        axios.get(`${API_BASE}/members/${memberId}`),
        axios.get(`${API_BASE}/member-classes/${memberId}`),
        axios.get(`${API_BASE}/member-payments/${memberId}`),
        axios.get(`${API_BASE}/member-notifications/${memberId}`),
        axios.get(`${API_BASE}/events`)
      ]);

      setMember(memberRes.data.member);
      setStats({
        classes: classesRes.data.classes?.length || 0,
        payments: paymentsRes.data.payments?.length || 0,
        notifications: notificationsRes.data.notifications?.length || 0,
        events: eventsRes.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ icon, title, count, color }) => (
    <TouchableOpacity style={[styles.statCard, { backgroundColor: color }]}>
      <Icon name={icon} size={30} color="white" />
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statCount}>{count}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.memberName}>{member?.fullName || 'Member'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard 
          icon="fitness-center" 
          title="Classes" 
          count={stats.classes} 
          color="#FF6B6B" 
        />
        <StatCard 
          icon="payment" 
          title="Payments" 
          count={stats.payments} 
          color="#4ECDC4" 
        />
        <StatCard 
          icon="notifications" 
          title="Notifications" 
          count={stats.notifications} 
          color="#45B7D1" 
        />
        <StatCard 
          icon="event" 
          title="Events" 
          count={stats.events} 
          color="#96CEB4" 
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="schedule" size={24} color="#2196F3" />
          <Text style={styles.actionText}>View Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="payment" size={24} color="#2196F3" />
          <Text style={styles.actionText}>Make Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="event" size={24} color="#2196F3" />
          <Text style={styles.actionText}>Register for Event</Text>
        </TouchableOpacity>
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
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 50,
  },
  welcomeText: {
    color: 'white',
    fontSize: 18,
  },
  memberName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  statTitle: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
  statCount: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});