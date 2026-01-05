import { auth, db } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Cross-platform alert
function showAlert(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !location) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: '',
        location,
        createdAt: new Date().toISOString(),
      });

      showAlert('Success', 'User registered successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setLocation('');
      router.push('/(tabs)');
    } catch (error) {
      console.error('Registration Error:', error);
      showAlert('Registration Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Image
        source={require('./../../assets/images/login.jpeg')}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >
          <Text style={styles.heading}>Create Account</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TextInput
            placeholder="Location (e.g., Mumbai, India)"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={{ color: '#2563EB', textAlign: 'center', marginTop: 20 }}>
              Login
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: '100%',
    paddingTop: 20,
  },
  inner: {
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  heading: {
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
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
