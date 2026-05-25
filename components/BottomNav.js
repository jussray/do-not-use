import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function BottomNav({ screen, setScreen, styles }) {
  return (
    <View style={styles.bottomNav}>
      {[
        ['home', '🏠', 'Home'],
        ['pages', '💜', 'Pages'],
        ['calm', '🌙', 'Calm'],
        ['circle', '🌐', 'Circle'],
        ['more', '☰', 'More'],
      ].map((item) => (
        <TouchableOpacity
          key={item[0]}
          onPress={() => setScreen(item[0])}
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>{item[1]}</Text>

          <Text
            style={[
              styles.navText,
              screen === item[0] && styles.activeNavText,
            ]}
          >
            {item[2]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}