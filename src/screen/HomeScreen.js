// src/screen/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/digital-art-with-planet-earth.png')} 
        style={styles.image}
      />
      <Text style={styles.title}>GREEN TITAN</Text>
      <Text style={styles.subtitle}>
        Let's rally together to educate the people on waste diversity, paving the way for a collective effort in preserving our planet's cleanliness.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFD9B2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#228B22',
    marginBottom: 30,
  },
});

export default HomeScreen;
