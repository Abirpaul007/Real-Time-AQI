import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const SignUpScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isFormComplete, setIsFormComplete] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsFormComplete(name && email && contact && password);
  }, [name, email, contact, password]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSignUp = () => {
    if (!isFormComplete) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    Alert.alert('Success', 'Signed up successfully!');
    router.replace('/HomeScreen'); // Adjust based on your home screen route
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.heroImage}>
          <Image source={require("./src/screens/Homei-removebg-preview.png")} style={styles.image1} resizeMode="contain" />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign-Up</Text>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Feather name="camera" size={24} color="gray" />
            )}
          </TouchableOpacity>
          <TextInput
            placeholder="Your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Your email-id"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Your contact number"
            style={styles.input}
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              style={styles.passwordInput}
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Feather name={passwordVisible ? "eye" : "eye-off"} size={20} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormComplete && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={!isFormComplete}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#002655',
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heroImage: {
    width: "100%",
    alignItems: "center",
    marginBottom: -16,
  },
  image1: {
    width: 250,
    height: 250,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#C2EBE4',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: 'center',
    marginTop: -40,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  imagePicker: {
    width: 90,
    height: 90,
    backgroundColor: '#f0f0f0',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#002655',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
