import React, { useState, useEffect, useContext, createContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Switch, SafeAreaView, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- REST API CONFIGURATION ---
const FIREBASE_API_KEY = "AIzaSyBwGz_pjNc71ED7ZSLhWlLpmIkexTbi0ZQ";
const FIREBASE_PROJECT_ID = "madterminal-6454c";

const AUTH_URL_SIGNUP = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const AUTH_URL_LOGIN = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/notes`;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- THEME CONTEXT SETUP ---
export const ThemeContext = createContext();

// Theme Color Palettes
const lightColors = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  subtitle: '#666666',
  inputBg: '#FFFFFF',
  inputBorder: '#DDDDDD',
  primary: '#6200EE',
  danger: '#E53935',
  headerBg: '#6200EE',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  subtitle: '#AAAAAA',
  inputBg: '#2C2C2C',
  inputBorder: '#444444',
  primary: '#BB86FC',
  danger: '#CF6679',
  headerBg: '#1F1F1F',
};

// --- AUTHENTICATION SCREENS ---

const LoginScreen = ({ navigation }) => {
  const { isDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      const response = await fetch(AUTH_URL_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await response.json();
      
      if (response.ok) {
        await AsyncStorage.setItem('@auth_token', data.idToken);
        await AsyncStorage.setItem('@user_email', data.email);
        navigation.replace('MainApp');
      } else {
        Alert.alert('Login Error', data.error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Student Companion</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SignupScreen = ({ navigation }) => {
  const { isDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      const response = await fetch(AUTH_URL_SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('@auth_token', data.idToken);
        await AsyncStorage.setItem('@user_email', data.email);
        navigation.replace('MainApp');
      } else {
        Alert.alert('Signup Error', data.error.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- MAIN TAB SCREENS ---

const HomeScreen = ({ navigation }) => {
  const { isDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem('@user_email');
      if (email) setUserEmail(email);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@user_email');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Logged in as:</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 15, color: isDark ? '#FFF' : '#333' }}>{userEmail}</Text>
      </View>
      <TouchableOpacity style={styles.dangerButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const NotesScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [fetching, setFetching] = useState(true);

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const response = await fetch(FIRESTORE_BASE_URL);
      const data = await response.json();
      
      if (data.documents) {
        const formattedNotes = data.documents.map(doc => ({
          id: doc.name, 
          title: doc.fields.title?.stringValue || 'No Title',
          description: doc.fields.description?.stringValue || 'No Description',
          timestamp: doc.createTime
        }));
        setNotes(formattedNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch notes');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!title || !desc) return Alert.alert('Validation Error', 'Title and Description are required');
    try {
      const response = await fetch(FIRESTORE_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            title: { stringValue: title },
            description: { stringValue: desc }
          }
        })
      });

      if (response.ok) {
        setTitle('');
        setDesc('');
        fetchNotes();
      } else {
        Alert.alert('Error', 'Failed to add note');
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  const deleteNote = async (documentPath) => {
    try {
      const deleteUrl = `https://firestore.googleapis.com/v1/${documentPath}`;
      const response = await fetch(deleteUrl, { method: 'DELETE' });

      if (response.ok) {
        fetchNotes(); 
      } else {
        Alert.alert('Error', 'Failed to delete note');
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed');
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteCard}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteDesc}>{item.description}</Text>
      <Text style={styles.noteTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      <TouchableOpacity onPress={() => deleteNote(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Note Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Note Description" value={desc} onChangeText={setDesc} />
        <TouchableOpacity style={styles.primaryButton} onPress={addNote}>
          <Text style={styles.buttonText}>Add Note</Text>
        </TouchableOpacity>
      </View>
      
      {fetching ? (
        <ActivityIndicator size="large" color={isDark ? "#BB86FC" : "#6200EE"} />
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          onRefresh={fetchNotes} 
          refreshing={fetching}
        />
      )}
    </View>
  );
};

const ExploreScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  const [weather, setWeather] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApis = async () => {
    try {
      const weatherRes = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Attock,pk&APPID=ca134792d925ff6828bccf7d0f29ab8e&units=metric');
      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const newsRes = await fetch('https://dummyjson.com/posts?limit=5');
      const newsData = await newsRes.json();
      setNews(newsData.posts);
    } catch (error) {
      Alert.alert('API Error', 'Failed to fetch external data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={isDark ? "#BB86FC" : "#6200EE"} /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Current Weather</Text>
      {weather && weather.main ? (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherCity}>{weather.name}</Text>
          <Text style={styles.weatherTemp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.weatherCondition}>{weather.weather[0].main} ({weather.weather[0].description})</Text>
        </View>
      ) : <Text style={styles.subtitle}>Weather data unavailable</Text>}

      <Text style={styles.sectionHeader}>Trending News</Text>
      <FlatList
        data={news}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.newsCard}>
            <View>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsRating}>Likes: {item.reactions.likes}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const SettingsScreen = () => {
  const { isDark, setIsDark } = useContext(ThemeContext);
  const styles = getStyles(isDark);
  
  const [username, setUsername] = useState('');
  const [subject, setSubject] = useState('');

  // Load purely form inputs on mount, Theme is already loaded in App.js
  useEffect(() => {
    const loadForm = async () => {
      const jsonValue = await AsyncStorage.getItem('@user_prefs');
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setUsername(data.username || '');
        setSubject(data.subject || '');
      }
    };
    loadForm();
  }, []);

  const saveData = async () => {
    try {
      const preferences = { username, subject, isDark };
      await AsyncStorage.setItem('@user_prefs', JSON.stringify(preferences));
      Alert.alert('Success', 'Data saved locally!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem('@user_prefs');
      setUsername('');
      setSubject('');
      setIsDark(false); // Reset theme
      Alert.alert('Success', 'Local data cleared!');
    } catch (e) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Preferences</Text>
        
        <Text style={styles.label}>Username</Text>
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="Enter your name" value={username} onChangeText={setUsername} />
        
        <Text style={styles.label}>Favorite Subject</Text>
        <TextInput style={styles.input} placeholderTextColor={isDark ? '#888' : '#aaa'} placeholder="e.g., Mobile App Dev" value={subject} onChangeText={setSubject} />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Dark Theme</Text>
          <Switch 
            value={isDark} 
            onValueChange={(val) => setIsDark(val)} 
            trackColor={{ false: "#767577", true: "#BB86FC" }}
            thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={styles.primaryButton} onPress={saveData}><Text style={styles.buttonText}>Save Data</Text></TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton} onPress={clearData}><Text style={styles.buttonText}>Clear Data</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- NAVIGATION SETUP ---

const MainTabs = () => {
  const { isDark } = useContext(ThemeContext);
  const colors = isDark ? darkColors : lightColors;

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerStyle: { backgroundColor: colors.headerBg }, 
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.inputBorder },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtitle
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // 1. Check Login
      const token = await AsyncStorage.getItem('@auth_token');
      setInitialRoute(token ? 'MainApp' : 'Login');

      // 2. Check Saved Theme Preference
      try {
        const prefs = await AsyncStorage.getItem('@user_prefs');
        if (prefs) {
          const parsed = JSON.parse(prefs);
          if (parsed.isDark) setIsDark(true);
        }
      } catch(e) { console.log('No saved theme'); }
    };
    initializeApp();
  }, []);

  if (!initialRoute) return null;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#F5F5F5' }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#1F1F1F' : '#6200EE'} />
        <NavigationContainer theme={isDark ? NavDarkTheme : DefaultTheme}>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="MainApp" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}

// --- DYNAMIC GLOBAL STYLES ---

const getStyles = (isDark) => {
  const colors = isDark ? darkColors : lightColors;

  return StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, marginTop: 40, color: colors.primary },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 15, marginBottom: 10, color: colors.text },
    card: { backgroundColor: colors.card, padding: 20, borderRadius: 10, elevation: 3, marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: colors.text },
    subtitle: { fontSize: 16, color: colors.subtitle, marginBottom: 5 },
    label: { fontSize: 14, fontWeight: 'bold', color: colors.subtitle, marginTop: 10, marginBottom: 5 },
    input: { backgroundColor: colors.inputBg, color: colors.text, borderWidth: 1, borderColor: colors.inputBorder, padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
    row: { flexDirection: 'row', alignItems: 'center' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    
    primaryButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    dangerButton: { backgroundColor: colors.danger, padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    linkText: { color: colors.primary, textAlign: 'center', marginTop: 10, fontWeight: '500' },
    
    noteCard: { backgroundColor: colors.card, padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: colors.primary, elevation: 2 },
    noteTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
    noteDesc: { fontSize: 14, color: colors.subtitle, marginVertical: 5 },
    noteTime: { fontSize: 12, color: isDark ? '#666' : '#999' },
    deleteText: { color: colors.danger, marginTop: 10, fontWeight: 'bold', textAlign: 'right' },
    
    weatherCard: { backgroundColor: colors.headerBg, padding: 20, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
    weatherCity: { fontSize: 20, color: '#FFF', fontWeight: 'bold' },
    weatherTemp: { fontSize: 36, color: '#FFF', fontWeight: 'bold', marginVertical: 5 },
    weatherCondition: { fontSize: 16, color: '#FFF', textTransform: 'capitalize' },
    
    newsCard: { flexDirection: 'row', backgroundColor: colors.card, padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
    newsTitle: { fontSize: 16, fontWeight: 'bold', flexShrink: 1, marginBottom: 5, color: colors.text },
    newsRating: { fontSize: 14, color: colors.subtitle },
  });
};