import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase'; // adjust path if needed

export default function HomeScreen({ navigation }) {
  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'your@email.com', // replace with your Supabase account
        password: 'yourpassword' // replace with your password
      });
      if (error) throw error;

      // Navigate to Grocery List after login
      navigation.navigate('GroceryList');
    } catch (error) {
      console.log('Sign in error:', error.message);
    }
  };

  const handleGuest = () => {
    // Navigate to Grocery List as Guest
    navigation.navigate('GroceryList', { guest: true });
  };

  return (
    <View style={styles.container}>
      <Button title="Continue as Guest" onPress={handleGuest} />
      <View style={{ height: 20 }} />
      <Button title="Sign In" onPress={handleSignIn} />
      <View style={{ height: 20 }} />
      <Button 
        title="Compare Prices" 
        onPress={() => navigation.navigate('PriceComparison')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
