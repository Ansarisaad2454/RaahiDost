import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  const [profile, setProfile] = useState<{
    displayName: string;
    email: string;
    location: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfile({
          displayName: data.displayName,
          email: data.email,
          location: data.location || 'Unknown',
        });
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
      router.push('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert('Password Reset', 'Check your email to reset your password.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Failed to load profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('./../../assets/images/prof.jpeg')}
          style={styles.topImage}
          resizeMode="cover"
        />

        <View style={styles.profileCard}>
          <Text style={styles.name}>{profile.displayName}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.location}>{profile.location}</Text>

          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleForgotPassword}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileCard: {
    marginTop: -40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  location: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
    fontStyle: 'italic',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    backgroundColor: '#60A5FA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 16,
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    marginTop: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
