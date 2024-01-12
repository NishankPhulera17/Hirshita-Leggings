import React, { useEffect } from 'react';
import {View, StyleSheet,ImageBackground} from 'react-native';

const BrandColaboration = ({navigation}) => {
    useEffect(()=>{
        setTimeout(() => {
            navigation.navigate("Splash")
        }, 2000);
    },[])
    return (
        <View style={{ flex: 1 }}>
          <ImageBackground resizeMode='stretch' style={{ flex: 1, height: '100%', width: '100%', }} source={require('../../../assets/images/btpl.png')}>
    
            {/* <Image  style={{ width: 200, height: 200,  }}  source={require('../../../assets/gif/ozonegif.gif')} /> */}
            {/* <FastImage
              style={{ width: 250, height: 250, marginTop:'auto',alignSelf:'center' }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            /> */}
    
          </ImageBackground>
    
        </View>
    
    
      );
}

const styles = StyleSheet.create({})

export default BrandColaboration;
