import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.info}>(Sign up form + Supabase will be added later)</Text>

      <View style={{ height: 20 }} />
      <Button title="Back to Login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  info: { marginTop: 8, color: COLORS.muted, textAlign: 'center' }
});
