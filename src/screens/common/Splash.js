import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground,PermissionsAndroid, Platform } from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';
import { useGetAppThemeDataMutation } from '../../apiServices/appTheme/AppThemeApi';
import { useSelector, useDispatch } from 'react-redux'
import { setPrimaryThemeColor, setSecondaryThemeColor, setIcon, setIconDrawer, setTernaryThemeColor, setOptLogin, setPasswordLogin, setButtonThemeColor, setColorShades, setKycOptions,setIsOnlineVeriification,setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile, setExtraFeatures,setQrType } from '../../../redux/slices/appThemeSlice';
import { setManualApproval, setAutoApproval, setRegistrationRequired } from '../../../redux/slices/appUserSlice';
import { setPointSharing } from '../../../redux/slices/pointSharingSlice';
import { useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAppUserType, setAppUserName, setAppUserId, setUserData, setId,setAllUsersData} from '../../../redux/slices/appUserDataSlice';
import messaging from '@react-native-firebase/messaging';    
import { setFcmToken } from '../../../redux/slices/fcmTokenSlice';
import { setAppUsers,setAppUsersData } from '../../../redux/slices/appUserSlice';
import { useGetAppUsersDataMutation } from '../../apiServices/appUsers/AppUsersApi';
import Geolocation from '@react-native-community/geolocation';
import InternetModal from '../../components/modals/InternetModal';

const Splash = ({ navigation }) => {
  const dispatch = useDispatch()
  const focused = useIsFocused()
  const [filteredArray, setFilteredArray] = useState()
  const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null);
  const [gotLoginData, setGotLoginData] = useState()
  const [connected, setConnected] = useState(true)
  const otpLogin = useSelector(state => state.apptheme.otpLogin)
  const passwordLogin = useSelector(state => state.apptheme.passwordLogin)
  const manualApproval = useSelector(state => state.appusers.manualApproval)
  const autoApproval = useSelector(state => state.appusers.autoApproval)
  const registrationRequired = useSelector(state => state.appusers.registrationRequired)
  const isConnected = useSelector(state => state.internet.isConnected);
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/btplGif.gif')).uri;
  console.log("internet connection status :",isConnected.isConnected)

  // generating functions and constants for API use cases---------------------
  const [
    getAppTheme,
    {
      data: getAppThemeData,
      error: getAppThemeError,
      isLoading: getAppThemeIsLoading,
      isError: getAppThemeIsError,
    }
  ] = useGetAppThemeDataMutation();
  const [
    getUsers,
    {
      data: getUsersData,
      error: getUsersError,
      isLoading: getUsersDataIsLoading,
      isError: getUsersDataIsError,
    },
  ] = useGetAppUsersDataMutation();

  useEffect(()=>{
    if(isConnected)
    {
      console.log(isConnected)
      setConnected(isConnected.isConnected)
    
    }
  },[isConnected])
  useEffect(()=>{
    getUsers();
    getAppTheme("hirshita-leggings")
    const checkToken = async () => {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
         console.log("fcmToken",fcmToken);
         dispatch(setFcmToken(fcmToken))
      } 
     }
     checkToken()
    const requestLocationPermission = async () => {
      try {
        if(Platform.OS==="android")
        {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Geolocation Permission',
              message: 'Can we access your location?',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log('granted', granted);
          if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
          } else {
            console.log('You cannot use Geolocation');
            return false;
          }
        }
        else{
          Geolocation.requestAuthorization()
        }
        
      } catch (err) {
        return false;
      }
    };
    requestLocationPermission()
  },[])
 

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('isAlreadyIntroduced', "Yes" );
    //   console.log("saved")
    } catch (e) {
      // saving error
      console.log("error",e)

    }
  };
  storeData()
  
  useEffect(() => {
    if (getUsersData) {
      let tempFilteredArray=[]
              
                    for(var i=0 ;i<getUsersData?.body?.length ;i++)
              {
                // ban certain type of users from accessing user screen -----------------------------------
                if((getUsersData?.body[i]?.user_type).toLowerCase()!=="distributor")
                {
                  tempFilteredArray.push(getUsersData?.body[i])
                }
                
              }
              if(tempFilteredArray.length!==0)
              {
                console.log("getfilteredUserType",tempFilteredArray)
                setFilteredArray(tempFilteredArray)
                dispatch(setAllUsersData(tempFilteredArray))
              }

      console.log("type of users",getUsersData.body);
      const appUsers = getUsersData.body.map((item,index)=>{
        return item.name
      })
      const appUsersData = getUsersData.body.map((item,index)=>{
        return {"name":item.name,
      "id":item.user_type_id
      }
      })
      console.log("appUsers",appUsers)
      dispatch(setAppUsers(appUsers))
      dispatch(setAppUsersData(appUsersData))
    } else if(getUsersError) {
      console.log("getUsersError",getUsersError);
    }
  }, [getUsersData, getUsersError]);
  useEffect(() => {
    if (getAppThemeData) {
      console.log("getAppThemeData", JSON.stringify(getAppThemeData.body))
      dispatch(setPrimaryThemeColor(getAppThemeData.body.theme.color_shades["600"]))
      dispatch(setSecondaryThemeColor(getAppThemeData.body.theme.color_shades["400"]))
      // dispatch(setTernaryThemeColor(getAppThemeData.body.theme.color_shades["400"]))
      dispatch(setTernaryThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setIcon(getAppThemeData.body.logo[0]))
      dispatch(setIconDrawer(getAppThemeData.body.logo[0]))
      dispatch(setOptLogin(getAppThemeData.body.login_options.Otp.users))
      dispatch(setPasswordLogin(getAppThemeData.body.login_options.Password.users))
      dispatch(setButtonThemeColor(getAppThemeData.body.theme.color_shades["700"]))
      dispatch(setManualApproval(getAppThemeData.body.approval_flow_options.Manual.users))
      dispatch(setAutoApproval(getAppThemeData.body.approval_flow_options.AutoApproval.users))
      dispatch(setRegistrationRequired(getAppThemeData.body.registration_options.Registration.users))
      dispatch(setColorShades(getAppThemeData.body.theme.color_shades))
      dispatch(setKycOptions(getAppThemeData.body.kyc_options))
      dispatch(setPointSharing(getAppThemeData?.body?.points_sharing))
      dispatch(setSocials(getAppThemeData.body.socials))
      dispatch(setWebsite(getAppThemeData.body.website))
      dispatch(setCustomerSupportMail(getAppThemeData.body.customer_support_email))
      dispatch(setCustomerSupportMobile(getAppThemeData.body.customer_support_mobile))
      dispatch(setExtraFeatures(getAppThemeData.body.addon_features))
      setQrType()
      if(getAppThemeData?.body?.qr_type==="1")
      {
        dispatch(setQrType("parent_child"))
      }
      
      if(getAppThemeData?.body?.addon_features?.kyc_online_verification!==undefined)
      {
        if(getAppThemeData?.body?.addon_features?.kyc_online_verification)
        {
          dispatch(setIsOnlineVeriification())
        }
      }
      console.log("isAlreadyIntro", isAlreadyIntroduced,filteredArray)
      filteredArray?.length!==0 && getData()
    }
    else if(getAppThemeError){
      

      console.log("getAppThemeIsError", getAppThemeIsError)
      console.log("getAppThemeError", getAppThemeError)
    }
   
  }, [getAppThemeData,getAppThemeError,filteredArray])

  const checkRegistrationRequired=(userType,userId)=>{
console.log("inside checkRegistrationRequired",userType,userId)
    setTimeout(() => {
        if(registrationRequired.includes(userType))
    {
        checkApprovalFlow(true,userType,userId)
        console.log("registration required")
    }
    else{
        checkApprovalFlow(false,userType,userId)
        console.log("registration not required")

    }
    }, 400);
    
}

const checkApprovalFlow=(registrationRequired,userType,userId)=>{
    if(manualApproval.includes(userType))
    {
        handleNavigation(true,registrationRequired,userType,userId)
    }
    else{
        handleNavigation(false,registrationRequired,userType,userId)
    }
    
}

const handleNavigation=(needsApproval,registrationRequired,userType,userId)=>{
    console.log("Needs Approval",needsApproval,userType,userId)
    if(otpLogin.includes(userType)
    ){
        navigation.navigate('OtpLogin',{needsApproval:needsApproval, userType:userType, userId:userId,registrationRequired:registrationRequired})
    }
    else{
        navigation.navigate('OtpLogin',{needsApproval:needsApproval, userType:userType, userId:userId,registrationRequired:registrationRequired})
    console.log("Password Login",userType,userId,registrationRequired,needsApproval)
    }

}
  
 
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('loginData');
        console.log("loginData",JSON.parse(jsonValue))
        const parsedJsonValue = JSON.parse(jsonValue)
        const value = await AsyncStorage.getItem('isAlreadyIntroduced');
        console.log("asynch value",value,jsonValue)

      if (value !== null && jsonValue!==null ) {
        // value previously stored
        try{
          console.log("Trying to dispatch",parsedJsonValue.user_type_id)
          dispatch(setAppUserId(parsedJsonValue.user_type_id))
          dispatch(setAppUserName(parsedJsonValue.name))
          dispatch(setAppUserType(parsedJsonValue.user_type))
          dispatch(setUserData(parsedJsonValue))
          dispatch(setId(parsedJsonValue.id))
          
          setTimeout(() => {
          navigation.navigate('Dashboard');
          }, 2000);

         
        }
        catch(e)
        {
          console.log("Error in dispatch", e)
        }

          // console.log("isAlreadyIntroduced",isAlreadyIntroduced)
        }
        else 
        {
        
            if(filteredArray.length===1)
            {
              checkRegistrationRequired(filteredArray[0]?.user_type,filteredArray[0].user_type_id)
            }
            else{
              console.log("filteredarraylength",filteredArray)
              if(value==="Yes")
              {
              setTimeout(() => {
              navigation.navigate("SelectUser")
                
              }, 2000);
            }
            else{
        navigation.navigate('Introduction')
            }
            }
          
          
               
              
           
              
              

                  
              // console.log("getfilteredUserType",getUsersData?.body)

            
            

          
         
          // console.log("isAlreadyIntroduced",isAlreadyIntroduced,gotLoginData)
    
          
           
       
    
        }

      }
        
       
        
        
       catch (e) {
        console.log("Error is reading loginData",e)
      }
    };
   
  
  

  
  
  // calling API to fetch themes for the app
  

  // fetching data and checking for errors from the API-----------------------
  


  


  return (
    <View style={{ flex: 1 }}>
      <ImageBackground resizeMode='cover' style={{ flex: 1, height: '100%', width: '100%', }} source={require('../../../assets/images/brandColaboration.png')}>
      {!connected &&  <InternetModal />}
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

export default Splash;