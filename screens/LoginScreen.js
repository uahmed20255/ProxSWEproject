import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.info}>(We'll add email/password inputs and Supabase logic later.)</Text>

      <View style={{ height: 20 }} />
      <Button title="Go to Signup" onPress={() => navigation.navigate('Signup')} />
      <View style={{ height: 8 }} />
      <Button title="Continue as Guest" color={COLORS.muted} onPress={() => navigation.replace('Guest')} />
      <View style={{ height: 8 }} />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  info: { marginTop: 8, color: COLORS.muted, textAlign: 'center' }
});
