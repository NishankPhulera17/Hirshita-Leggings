import React, { useEffect } from 'react';
import {View, StyleSheet,ImageBackground,Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
const BrandColaboration = ({navigation}) => {
  const focused = useIsFocused()

    useEffect(()=>{
      
            navigation.navigate("Splash")
        
       
      }
    ,[focused])

    
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/btplGif.gif')).uri;

    return (
        <View style={{ flex: 1 }}>
          {/* <ImageBackground resizeMode='contain' style={{ flex: 1, height: '100%', width: '100%', }} source={require('../../../assets/images/btpl.png')}> */}
    
            {/* <Image  style={{ width: 200, height: 200,  }}  source={require('../../../assets/gif/ozonegif.gif')} /> */}
            <FastImage
              style={{ width:'100%', height: '100%',  }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
    
          {/* </ImageBackground> */}
    
        </View>
    
    
      );
}

const styles = StyleSheet.create({})

export default BrandColaboration;
