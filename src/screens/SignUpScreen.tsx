// src/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { firebaseAuth } from '../firebase/FirebaseConfig';
import firestore        from '@react-native-firebase/firestore';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const handleSignUp = async () => {
    if (password !== confirm) {
      setError("Les mots de passe ne sont pas identiques!");
      return;
    }
    if (!username.trim()) {
      setError("Il faut choisir un nom d'utilisateur!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userCred = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user     = userCred.user;

      await user.updateProfile({ displayName: username });
      await firestore().collection('users').doc(user.uid).set({
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>S'inscrire</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d’utilisateur"
        placeholderTextColor="#777"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, { color: '#000' }]}
        placeholder="Mot de passe"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={[styles.input, { color: '#000' }]}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#777"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer un compte</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('SignIn')}>
        <Text style={styles.link}>Vous avez déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});
