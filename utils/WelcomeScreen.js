import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ route, navigation }) => {
  const { username } = route.params;

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <Button title="Log Out" onPress={handleLogout} color="#ff6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2f4f4f',
    marginBottom: 30,
  },
});

export default WelcomeScreen;
