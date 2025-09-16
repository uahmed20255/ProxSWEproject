import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

export default function GuestScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest Session</Text>
      <Text style={styles.info}>You are now using Prox as a guest. Data will be local only.</Text>

      <View style={{ height: 20 }} />
      <Button title="Go to Grocery List" onPress={() => navigation.replace('GroceryList')} color={COLORS.primary} />
      <View style={{ height: 8 }} />
      <Button title="Back to Home" onPress={() => navigation.replace('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  info: { marginTop: 8, color: COLORS.muted, textAlign: 'center' }
});
