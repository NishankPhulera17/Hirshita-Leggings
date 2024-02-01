import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ZoomViewAnimations = (props) => {
  const zoomAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(zoomAnimation, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
      Animated.timing(zoomAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, [zoomAnimation]);

  return (
    <Animated.View style={{ transform: [{ scale: zoomAnimation }], ...props.style }}>
      {<props.comp />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});

export default ZoomViewAnimations;


