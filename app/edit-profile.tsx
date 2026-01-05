import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // ✅ added getDoc
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

export default function EditProfileScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
  if (!user) return;

  const loadData = async () => {
    try {
      setName(user.displayName || '');

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setLocation(docSnap.data()?.location || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [user]);


  const handleSave = async () => {
    if (!name || !location) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    setSaving(true);

    try {
      // Update Auth displayName
      await updateProfile(user!, { displayName: name });

      // Update Firestore
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, {
        displayName: name,
        location: location,
      });

      Alert.alert('Success', 'Profile updated!');
      router.back(); // Go back to profile screen
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Edit Profile</Text>

        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TextInput
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          placeholderTextColor="#aaa"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
