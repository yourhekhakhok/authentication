import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserAuthApp() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    profilePicture: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const savedData = await AsyncStorage.getItem('userProfile');
      const loginStatus = await AsyncStorage.getItem('isAuthenticated');
      if (savedData) setUserProfile(JSON.parse(savedData));
      if (loginStatus === 'true') setIsAuthenticated(true);
    };
    loadUserData();
  }, []);

  const handleAuthSubmit = async () => {
    if (isLoginMode) {
      const savedData = await AsyncStorage.getItem('userProfile');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (userProfile.username === parsedData.username && userProfile.password === parsedData.password) {
          setIsAuthenticated(true);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          Alert.alert('Success', 'Logged in successfully');
        } else {
          Alert.alert('Login Failed', 'Invalid credentials');
        }
      }
    } else {
      await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
      setIsAuthenticated(true);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      Alert.alert('Registration Successful', 'Account created successfully');
      setIsLoginMode(true);  
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUserProfile({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      address: '',
      profilePicture: ''
    });
    await AsyncStorage.removeItem('isAuthenticated');
  };

  const toggleEditMode = () => setIsEditingProfile(prevState => !prevState);

  const handleSaveProfileChanges = async () => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    setIsEditingProfile(false);
    Alert.alert('Profile Updated', 'Your profile has been updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated ? (
        <ScrollView style={styles.profileView}>
          <View style={styles.profileSection}>
            <Image 
              source={userProfile.profilePicture ? { uri: userProfile.profilePicture } : require('./assets/default-pfp.jpg')}
              style={styles.profileImage}
            />
            <Text style={styles.greetingText}>Hello, {userProfile.firstName}!</Text>
            <View style={styles.profileDetails}>
              {!isEditingProfile ? (
                Object.entries(userProfile).map(([key, value]) => key !== 'profilePicture' && (
                  <Text style={styles.infoText} key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Text>
                ))
              ) : (
                Object.entries(userProfile).map(([key, value]) => key !== 'profilePicture' && (
                  <TextInput
                    key={key}
                    style={styles.inputField}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChangeText={(text) => setUserProfile({ ...userProfile, [key]: text })}
                  />
                ))
              )}
            </View>
            <TouchableOpacity style={styles.editButton} onPress={isEditingProfile ? handleSaveProfileChanges : toggleEditMode}>
              <Text style={styles.buttonText}>{isEditingProfile ? 'Save Changes' : 'Edit Profile'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.authContainer}>
          <Image source={require('./assets/logo.png')} style={styles.appLogo} />
          <View style={styles.authForm}>
            <Text style={styles.title}>{isLoginMode ? 'Login' : 'Sign Up'}</Text>
            {['username', 'password'].map((field, index) => (
              <TextInput
                key={index}
                style={styles.inputField}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={userProfile[field]}
                onChangeText={(text) => setUserProfile({ ...userProfile, [field]: text })}
                secureTextEntry={field === 'password'}
              />
            ))}
            <TouchableOpacity style={styles.mainButton} onPress={handleAuthSubmit}>
              <Text style={styles.buttonText}>{isLoginMode ? 'Login' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsLoginMode(prev => !prev)}>
            <Text style={styles.switchText}>
              {isLoginMode ? 'New here? Sign up' : 'Already have an account? Login'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileView: { padding: 20, backgroundColor: '#fff' },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#e9e9e9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  profileImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#fff', marginBottom: 10 },
  greetingText: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 10 },
  profileDetails: { width: '100%', marginVertical: 20 },
  infoText: { fontSize: 16, color: '#333', marginBottom: 10 },
  inputField: { height: 45, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginBottom: 15, paddingLeft: 10 },
  editButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 5, marginTop: 20 },
  logoutButton: { backgroundColor: '#FF4C4C', padding: 12, borderRadius: 5, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  authContainer: { padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  mainButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, marginBottom: 20 },
  switchText: { textAlign: 'center', color: '#007BFF' },
  authForm: { backgroundColor: '#fff', borderRadius: 10, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  appLogo: { width: 220, height: 220, alignSelf: 'center', marginBottom: 30 },
});
