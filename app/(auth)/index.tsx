import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Button,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <ImageBackground
        source={require('../../assets/images/back.jpeg')}
        style={styles.background}
        resizeMode="cover"
      >
        <BlurView intensity={90} tint="dark" style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>Welcome to RaahiDost</Text>
            <Text style={styles.subtitle}>
              Your Budget-Friendly Travel Buddy
            </Text>
            <View style={styles.button}>
              <Button
                title="Get Started"
                color="#1e90ff"
                onPress={() => router.push('/login')}
              />
            </View>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ensures root View takes full screen
  },
  background: {
    flex: 1, 
    width: '100%', 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
