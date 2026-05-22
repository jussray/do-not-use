# Se-kret-Bip
 import React, { useState, useEffect, useRef } from 'react'; 
 import {
  Text,
  StyleSheet,
  TouchableOpacity,
 ScrollView,
  TextInput,
  View,
  Animated,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
export default function App() {
  
  const [circlePostText, setCirclePostText] = useState('');
  const [circlePosts, setCirclePosts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [screen, setScreen] = useState('home');
  const [journalText, setJournalText] = useState('');
  const [mood, setMood] = useState('Happy');
  const [theme, setTheme] = useState('night');
  const [entries, setEntries] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const comfortMessages = [
    { emoji: '🌙', text: "You've survived every hard day so far. That matters." },
    { emoji: '☁️', text: 'Rest is productive too. You are allowed to pause.' },
    { emoji: '💙', text: "Someone is glad you’re still here tonight." },
    { emoji: '🌧️', text: 'Bad moments are real. So is your strength.' },
    { emoji: '✨', text: 'You don’t need to be perfect to be loved.' },
    { emoji: '🫶', text: 'Your feelings are allowed here.' },
    { emoji: '🕯️', text: 'Soft moment. Slow breath. Stay with me.' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
  saveData();
}, [journalText, mood, theme, entries, moodHistory, voiceNotes, circlePosts]);
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(breatheAnim, {
        toValue: 1.1,
        duration: 2200,
        useNativeDriver: true,
      }),
  
      Animated.timing(breatheAnim, {
        toValue: 1,
        duration: 2200,
        useNativeDriver: true,
      }),
    ])
  ).start();
}, []);
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('journalText', journalText);
      await AsyncStorage.setItem('mood', mood);
      await AsyncStorage.setItem('theme', theme);
      await AsyncStorage.setItem('entries', JSON.stringify(entries));
      await AsyncStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      await AsyncStorage.setItem('voiceNotes', JSON.stringify(voiceNotes));
      await AsyncStorage.setItem('circlePosts', JSON.stringify(circlePosts));
    } catch (error) {
      console.log('Save error:', error);
    }
  };

  const loadData = async () => {
    try {
      const savedJournal = await AsyncStorage.getItem('journalText');
      const savedMood = await AsyncStorage.getItem('mood');
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedEntries = await AsyncStorage.getItem('entries');
      const savedMoodHistory = await AsyncStorage.getItem('moodHistory');
      const savedVoiceNotes = await AsyncStorage.getItem('voiceNotes');
      const savedCirclePosts = await AsyncStorage.getItem('circlePosts');

      if (savedJournal !== null) setJournalText(savedJournal);
      if (savedMood !== null) setMood(savedMood);
      if (savedTheme !== null) setTheme(savedTheme);
      if (savedEntries !== null) setEntries(JSON.parse(savedEntries));
      if (savedMoodHistory !== null) setMoodHistory(JSON.parse(savedMoodHistory));
      if (savedVoiceNotes !== null) setVoiceNotes(JSON.parse(savedVoiceNotes));
      if (savedCirclePosts !== null) setCirclePosts(JSON.parse(savedCirclePosts));
    } catch (error) {
      console.log('Load error:', error);
    }
  };

  const getBackground = () => {
    if (theme === 'flower') return '#2D1B3D';
    if (theme === 'rain') return '#1E293B';
    return '#3B1930';
  };

  const getHeroText = () => {
    if (mood === 'Happy') return "I’m glad\nyou’re smiling\ntonight 🌤️";
    if (mood === 'Sad') return "I’m here with\nyou tonight ☁️";
    if (mood === 'Angry') return "Let it out,\nyou’re safe here 🔥";
    if (mood === 'Tired') return "Rest your heart\ntonight 🌙";
    return "Welcome back 🌙";
  };

  const selectMood = (newMood) => {
    setMood(newMood);

    const newMoodEntry = {
      id: Date.now(),
      mood: newMood,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setMoodHistory([newMoodEntry, ...moodHistory]);
  }; 
  
  const saveEntry = () => {
  if (journalText.trim() === '') return;

  const newEntry = {
    id: Date.now(),
    text: journalText,
    mood,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  setEntries([newEntry, ...entries]);
  setJournalText('');
};

const saveVoiceNote = () => {
  const newVoiceNote = {
    id: Date.now(),
    title: 'Practice voice note',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };

  setVoiceNotes([newVoiceNote, ...voiceNotes]);
};

const saveCirclePost = () => {
  if (circlePostText.trim() === '') return;

  const newPost = {
    id: Date.now(),
    text: circlePostText,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    reactions: {
      glow: 0,
      heart: 0,
      moon: 0,
    },
  };

  setCirclePosts([newPost, ...circlePosts]);
  setCirclePostText('');
};

const reactToPost = (postId, reactionType) => {
  setCirclePosts(
    circlePosts.map((post) =>
      post.id === postId
        ? {
            ...post,
            reactions: {
              ...post.reactions,
              [reactionType]: post.reactions[reactionType] + 1,
            },
          }
        : post
    )
  );
};

const changeMessage = () => {


const changeMessage = () => {
  setMessageIndex((prevIndex) => (prevIndex + 1) % comfortMessages.length);
};
  
const BottomNav = () => (
    <View style={styles.bottomNav}>
     {[
  ['home', '🏠', 'Home'],
  ['journal', '📝', 'Journal'],
  ['calm', '🌙', 'Calm'],
  ['voice', '🎙️', 'Voice'],
  ['more', '☰', 'More'],
].map((item) => (
        <TouchableOpacity key={item[0]} onPress={() => setScreen(item[0])} style={styles.navItem}>
          <Text style={styles.navIcon}>{item[1]}</Text>
          <Text style={[styles.navText, screen === item[0] && styles.activeNavText]}>
            {item[2]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (screen === 'journal') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Secret Journal ✨</Text>
        <Text style={styles.subtitle}>Let your thoughts out safely.</Text>

        <TextInput
          style={styles.journalInput}
          placeholder="Write your thoughts here..."
          placeholderTextColor="#94A3B8"
          multiline
          value={journalText}
          onChangeText={setJournalText}
        />

        <TouchableOpacity style={styles.button} onPress={saveEntry}>
          <Text style={styles.buttonText}>Save Entry</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Past Entries</Text>

        {entries.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <Text style={styles.entryDate}>{entry.date} • {entry.time} • {entry.mood}</Text>
            <Text style={styles.entryText}>{entry.text}</Text>
          </View>
        ))}

        <BottomNav />
      </ScrollView>
    );
  }

  if (screen === 'calm') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Calm Space 🌙</Text>
        <Text style={styles.subtitle}>Breathe slowly. You are safe here.</Text>

 <Animated.View style={[styles.circle, { transform: [{ scale: breatheAnim }] }]}>
          <Text style={styles.circleText}>Breathe</Text>
   </Animated.View>

        <View style={styles.messageCard}>
          <Text style={styles.cardEmoji}>🫧</Text>
          <Text style={styles.cardText}>Inhale. Hold. Exhale. Stay with the Bip.</Text>
        </View>

        <BottomNav />
      </ScrollView>
    );
  }

  if (screen === 'growth') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Growth Garden 🌱</Text>
        <Text style={styles.subtitle}>Tiny steps still count. Your growth does not have to be loud.</Text>

        <View style={styles.messageCard}>
          <Text style={styles.cardEmoji}>🌿</Text>
          <Text style={styles.cardText}>Today’s growth: showing up for yourself.</Text>
        </View>

        <View style={styles.entryCard}>
          <Text style={styles.entryText}>🌱 Drink water</Text>
          <Text style={styles.entryText}>🌱 Take one soft breath</Text>
          <Text style={styles.entryText}>🌱 Write one honest sentence</Text>
        </View>

        <BottomNav />
      </ScrollView>
    );
  }

  if (screen === 'history') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Mood History 📈</Text>
        <Text style={styles.subtitle}>Your feelings have a story. Bip remembers gently.</Text>

        {moodHistory.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.cardEmoji}>📊</Text>
            <Text style={styles.cardText}>Choose a mood on Home to start your history.</Text>
          </View>
        ) : (
          moodHistory.map((item) => (
            <View key={item.id} style={styles.entryCard}>
              <Text style={styles.entryText}>{item.mood}</Text>
              <Text style={styles.entryDate}>{item.date} • {item.time}</Text>
            </View>
          ))
        )}

        <BottomNav />
      </ScrollView>
    );
  }

  if (screen === 'voice') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>Voice Notes 🎙️</Text>

      <Text style={styles.subtitle}>
        {isRecording
          ? 'Se’kret is listening... let your orb speak.'
          : 'Tap record when you’re ready to Bip it out.'}
      </Text>

      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: breatheAnim }],
            marginBottom: 30,
            backgroundColor: isRecording ? '#EF4444' : '#3B82F6',
          },
        ]}
      >
        <Text style={styles.circleText}>
          {isRecording ? '🔴' : '🎙️'}
        </Text>
      </Animated.View>

      {isRecording && (
        <View style={styles.waveRow}>
          <Animated.View
            style={[
              styles.waveBar,
              {
                transform: [{ scaleY: breatheAnim }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 60,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.6],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 35,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.3],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 75,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.8],
                  }),
                }],
              },
            ]}
          />

          <Animated.View
            style={[
              styles.waveBar,
              {
                height: 45,
                transform: [{
                  scaleY: breatheAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.4],
                  }),
                }],
              },
            ]}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, isRecording && { backgroundColor: '#EF4444' }]}
        onPress={() => {
          if (isRecording) {
            saveVoiceNote();
          }

          setIsRecording(!isRecording);
        }}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Bippin 🎙️'}
        </Text>
      </TouchableOpacity>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>🌙</Text>
        <Text style={styles.cardText}>
          {isRecording
            ? 'No pressure. No perfect words. Just let it out.'
            : 'Your voice notes are little pieces of your story.'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Saved Bips</Text>

      {voiceNotes.length === 0 ? (
        <View style={styles.entryCard}>
          <Text style={styles.entryText}>
            No voice Bips yet. When you stop recording, Se’kret will save the moment here.
          </Text>
        </View>
      ) : (
        voiceNotes.map((note) => (
          <View key={note.id} style={styles.entryCard}>
            <Text style={styles.entryText}>🎧 {note.title}</Text>
            <Text style={styles.entryDate}>{note.date} • {note.time}</Text>
          </View>
        ))
      )}

      <BottomNav />
    </ScrollView>
  );
}

if (screen === 'circle') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>Bip Circle 🌐</Text>

      <Text style={styles.subtitle}>
        A soft anonymous space to vent, heal, and connect.
      </Text>

      <TextInput
        style={styles.journalInput}
        placeholder="Share something with the Circle..."
        placeholderTextColor="#94A3B8"
        multiline
        value={circlePostText}
        onChangeText={setCirclePostText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveCirclePost}
      >
        <Text style={styles.buttonText}>Post to Circle ✨</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent Bips</Text>

      {circlePosts.length === 0 ? (
        <View style={styles.entryCard}>
          <Text style={styles.entryText}>
            No Circle posts yet. Your words could help someone tonight.
          </Text>
        </View>
      ) : (
        circlePosts.map((post) => (
          <View key={post.id} style={styles.entryCard}>

            <Text style={styles.entryDate}>
              {post.date} • {post.time}
            </Text>

            <Text style={styles.entryText}>
              {post.text}
            </Text>

            <View style={styles.reactionRow}>

            <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'glow')}
>
                <Text style={styles.reactionText}>
                  ✨ {post.reactions.glow}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'heart')}
> <Text style={styles.reactionText}>
                  💙 {post.reactions.heart}
                </Text>
              </TouchableOpacity>

            <TouchableOpacity
  style={styles.reactionButton}
  onPress={() => reactToPost(post.id, 'moon')}
>
                <Text style={styles.reactionText}>
                  🌙 {post.reactions.moon}
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        ))
      )}

      <BottomNav />
    </ScrollView>
  );
}

  if (screen === 'comfort') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Comfort Mode 🚨</Text>
        <Text style={styles.subtitle}>When it feels heavy, Bip stays with you.</Text>

        <View style={styles.messageCard}>
          <Text style={styles.cardEmoji}>💙</Text>
          <Text style={styles.cardText}>You are not alone in this moment.</Text>
        </View>

        <View style={styles.entryCard}>
          <Text style={styles.entryText}>1. Put both feet on the floor.</Text>
          <Text style={styles.entryText}>2. Name 3 things you can see.</Text>
          <Text style={styles.entryText}>3. Take one slow breath.</Text>
          <Text style={styles.entryText}>4. Tap Calm if you need to breathe.</Text>
        </View>

        <BottomNav />
      </ScrollView>
    );
  }

  if (screen === 'more') {
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>

      <Text style={styles.logo}>Se’kret Bip</Text>

      <Text style={styles.welcome}>More ✨</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('growth')}
      >
        <Text style={styles.buttonText}>🌱 Growth Garden</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('history')}
      >
        <Text style={styles.buttonText}>📈 Mood History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('circle')}
      >
        <Text style={styles.buttonText}>🌐 Bip Circle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('comfort')}
      >
        <Text style={styles.buttonText}>🚨 Comfort Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setScreen('settings')}
      >
        <Text style={styles.buttonText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <BottomNav />
    </ScrollView>
  );
}

  if (screen === 'settings') {
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
        <Text style={styles.logo}>Se’kret Bip</Text>
        <Text style={styles.welcome}>Settings ⚙️</Text>
        <Text style={styles.subtitle}>Choose your Bip vibe.</Text>

        <View style={styles.themeRow}>
          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('night')}>
            <Text style={styles.themeEmoji}>🌙</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('flower')}>
            <Text style={styles.themeEmoji}>🌸</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.themeBubble} onPress={() => setTheme('rain')}>
            <Text style={styles.themeEmoji}>🌧️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.currentMood}>Current Theme: {theme}</Text>

        <BottomNav />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: getBackground() }]}>
      <Text style={styles.logo}>Se’kret Bip</Text>
      <Text style={styles.heroText}>{getHeroText()}</Text>

      <Text style={styles.subtitle}>
        A safe place for your emotions, thoughts, and growth.
      </Text>

      <View style={styles.messageCard}>
        <Text style={styles.cardEmoji}>{comfortMessages[messageIndex].emoji}</Text>
        <Text style={styles.cardText}>{comfortMessages[messageIndex].text}</Text>

        <TouchableOpacity style={styles.smallButton} onPress={changeMessage}>
          <Text style={styles.smallButtonText}>New Message ✨</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.moodRow}>
        {[
          ['Happy', '😊'],
          ['Sad', '😔'],
          ['Angry', '😡'],
          ['Tired', '😴'],
        ].map((item) => (
          <TouchableOpacity
            key={item[0]}
            style={[styles.moodBubble, mood === item[0] && styles.selectedMoodBubble]}
            onPress={() => selectMood(item[0])}
          >
            <Text style={styles.moodEmoji}>{item[1]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.currentMood}>Current Mood: {mood}</Text>

      <BottomNav />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 60,
  },

  logo: {
  fontSize: 34,
  fontWeight: '900',
  color: '#FFFFFF',
  marginBottom: 40,
},

heroText: {
  fontSize: 42,
  fontWeight: '900',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: 52,
  marginBottom: 30,
},

welcome: {
  fontSize: 30,
  fontWeight: '900',
  color: '#FFFFFF',
  textAlign: 'center',
  marginBottom: 14,
},

subtitle: {
  fontSize: 18,
  color: '#CBD5E1',
  textAlign: 'center',
  lineHeight: 28,
  marginBottom: 40,
  fontWeight: '700',
},

cardEmoji: {
  fontSize: 42,
  marginBottom: 18,
},

cardText: {
  fontSize: 24,
  color: '#FFFFFF',
  fontWeight: '900',
  textAlign: 'center',
  lineHeight: 34,
  marginBottom: 24,
},

buttonText: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '900',
},

currentMood: {
  fontSize: 22,
  fontWeight: '900',
  color: '#FFFFFF',
  marginBottom: 32,
  textAlign: 'center',
},

sectionTitle: {
  fontSize: 26,
  fontWeight: '900',
  color: '#FFFFFF',
  alignSelf: 'flex-start',
  marginBottom: 16,
},

entryText: {
  color: '#FFFFFF',
  fontSize: 17,
  lineHeight: 26,
  fontWeight: '700',
  marginBottom: 8,
},

circleText: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: '900',
},

entryDate: {
  color: '#CBD5E1',
  fontSize: 14,
  fontWeight: '800',
  marginBottom: 8,
},

circle: {
  width: 170,
  height: 170,
  borderRadius: 85,
  backgroundColor: '#3B82F6',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 55,
  shadowColor: '#60A5FA',
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.9,
  shadowRadius: 25,
  elevation: 18,
},
waveRow: {
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: 8,
  marginBottom: 35,
},

waveBar: {
  width: 10,
  height: 50,
  backgroundColor: '#60A5FA',
  borderRadius: 20,
},
  
  reactionRow: {
  flexDirection: 'row',
  marginTop: 18,
  gap: 12,
},

reactionButton: {
  backgroundColor: '#334155',
  paddingVertical: 8,
  paddingHorizontal: 14,
  borderRadius: 20,
},

reactionText: {
  color: '#FFFFFF',
  fontWeight: '800',
  fontSize: 14,
},

    bottomNav: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

 navItem: {
  alignItems: 'center',
  width: '20%',
},

  navIcon: {
    fontSize: 22,
    textAlign: 'center',
  },

  navText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },

    activeNavText: {
    color: '#FFFFFF',
  },
});