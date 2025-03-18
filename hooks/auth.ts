import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000';

// Store Token
export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('authToken', token);
    console.log("🔑 Token stored successfully");
  } catch (error) {
    console.error(' Error storing token:', error);
  }
};

// Retrieve Token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    console.log("🔍 Retrieved Token:", token);
    return token;
  } catch (error) {
    console.error(' Error retrieving token:', error);
    return null;
  }
};

// Login Function
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      await storeToken(data.token); // Store JWT Token
      return data;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  } catch (error) {
    console.error(' Login error:', error);
    return null;
  }
};

// Logout Function (Clears Token & Navigates to Login)
export const logout = async (router: any) => {
  try {
    await AsyncStorage.removeItem('authToken'); // Remove JWT Token
    console.log("🚪 Logged out successfully");
    router.push('/login'); // Navigate to login page
  } catch (error) {
    console.error(' Error logging out:', error);
  }
};

// Register User
export const registerUser = async (firstName: string, lastName: string, email: string, password: string, role: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        password, 
        role 
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Registration failed');
    }
  } catch (error) {
    console.error(' Registration error:', error);
    return null;
  }
};
