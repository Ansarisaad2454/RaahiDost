import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

function showAlert(title, message) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showAlert('Error', 'Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      showAlert('Success', 'User logged in successfully!');
      setEmail('');
      setPassword('');
      router.push('/(tabs)');
    } catch (error) {
      console.error("Login Error:", error);
      if (error.code === 'auth/invalid-email') {
        showAlert('Login Error', 'Invalid email format.');
      } else if (error.code === 'auth/wrong-password') {
        showAlert('Login Error', 'Incorrect password.');
      } else if (error.code === 'auth/user-not-found') {
        showAlert('Login Error', 'No user found with this email.');
      } else {
        showAlert('Login Error', error.message || 'Something went wrong.');
      }
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
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.inner}
        >
          <Text style={styles.heading}>Login Here</Text>

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

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={{ color: '#2563EB', textAlign: 'center', marginTop: 20 }}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
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
