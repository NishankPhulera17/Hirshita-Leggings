import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity,Image, Linking,BackHandler,Alert} from 'react-native';
import MenuItems from '../../components/atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import { useGetAppDashboardDataMutation } from '../../apiServices/dashboard/AppUserDashboardApi';
import { useGetAppUserBannerDataMutation } from '../../apiServices/dashboard/AppUserBannerApi';
import * as Keychain from 'react-native-keychain';
import DashboardMenuBox from '../../components/organisms/DashboardMenuBox';
import Banner from '../../components/organisms/Banner';
import DrawerHeader from '../../components/headers/DrawerHeader';
import DashboardDataBox from '../../components/molecules/DashboardDataBox';
import KYCVerificationComponent from '../../components/organisms/KYCVerificationComponent';
import DashboardSupportBox from '../../components/molecules/DashboardSupportBox';
import { useGetWorkflowMutation } from '../../apiServices/workflow/GetWorkflowByTenant';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import { useSelector, useDispatch } from 'react-redux';
import { setProgram, setWorkflow, setIsGenuinityOnly } from '../../../redux/slices/appWorkflowSlice';
import { setWarrantyForm, setWarrantyFormId } from '../../../redux/slices/formSlice';
import { setLocation } from '../../../redux/slices/userLocationSlice';
import Geolocation from '@react-native-community/geolocation';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { setKycData } from '../../../redux/slices/userKycStatusSlice';
import { useIsFocused } from '@react-navigation/native';
import { setPercentagePoints, setShouldSharePoints } from '../../../redux/slices/pointSharingSlice';
import { useExtraPointEnteriesMutation } from '../../apiServices/pointSharing/pointSharingApi';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import { useFetchUserPointsHistoryMutation, useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { setQrIdList } from '../../../redux/slices/qrCodeDataSlice';
import CampaignVideoModal from '../../components/modals/CampaignVideoModal';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import FastImage from 'react-native-fast-image';
import ScannedDetailsBox from '../../components/organisms/ScannedDetailsBox';
import moment from 'moment';
import  Facebook  from 'react-native-vector-icons/AntDesign';
import  Youtube  from 'react-native-vector-icons/AntDesign';
import  Instagram  from 'react-native-vector-icons/AntDesign';
import  Link  from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';




const Dashboard = ({ navigation }) => {
  const [dashboardItems, setDashboardItems] = useState()
  const [bannerArray, setBannerArray] = useState()
  const [showKyc, setShowKyc] = useState(true)
  const [CampainVideoVisible, setCmpainVideoVisible] = useState(true);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
  const [membership, setMembership] = useState()
  const [scanningDetails, seScanningDetails] = useState()
  const [showLink, setShowLink] = useState(false)
  const focused = useIsFocused()
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.appusersdata.userId)
  const idUser = useSelector(state => state.appusersdata.id);
  const userData = useSelector(state => state.appusersdata.userData);
  const pointSharingData = useSelector(state => state.pointSharing.pointSharing)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#FFB533';
  
    const gifUri = Image.resolveAssetSource(
      require("../../../assets/gif/loader.gif")
    ).uri;
  console.log("pointSharingData", JSON.stringify(pointSharingData), userData)
  console.log("user id is from dashboard", userId)
    console.log(focused)
    let startDate,endDate
    const [getActiveMembershipFunc, {
      data: getActiveMembershipData,
      error: getActiveMembershipError,
      isLoading: getActiveMembershipIsLoading,
      isError: getActiveMembershipIsError
    }] = useGetActiveMembershipMutation()
  

  const [getDashboardFunc, {
    data: getDashboardData,
    error: getDashboardError,
    isLoading: getDashboardIsLoading,
    isError: getDashboardIsError
  }] = useGetAppDashboardDataMutation()

  const [fetchUserPointsHistoryFunc, {
    data: fetchUserPointsHistoryData,
    error: fetchUserPointsHistoryError,
    isLoading: fetchUserPointsHistoryLoading,
    isError: fetchUserPointsHistoryIsError
}] = useFetchUserPointsHistoryMutation()

  const [getKycStatusFunc, {
    data: getKycStatusData,
    error: getKycStatusError,
    isLoading: getKycStatusIsLoading,
    isError: getKycStatusIsError
  }] = useGetkycStatusMutation()

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
  }] = useFetchUserPointsMutation()

  const [getBannerFunc, {
    data: getBannerData,
    error: getBannerError,
    isLoading: getBannerIsLoading,
    isError: getBannerIsError
  }] = useGetAppUserBannerDataMutation()

  const [getWorkflowFunc, {
    data: getWorkflowData,
    error: getWorkflowError,
    isLoading: getWorkflowIsLoading,
    isError: getWorkflowIsError
  }] = useGetWorkflowMutation()
  
  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError
  }] = useGetFormMutation()

  const [extraPointEntriesFunc, {
    data: extraPointEntriesData,
    error: extraPointEntriesError,
    isError: extraPointEntriesIsError,
    isLoading: extraPointEntriesIsLoading
  }] = useExtraPointEnteriesMutation()
  const id = useSelector(state => state.appusersdata.id);

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token
    }
    userPointFunc(params)

  }

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
       
       
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
   
      fetchPoints()
      dispatch(setQrIdList([]))
      fetchPointsHistory()

      let lat = ''
    let lon = ''
    Geolocation.getCurrentPosition((res) => {
      console.log("res", res)
      lat = res.coords.latitude
      lon = res.coords.longitude
      // getLocation(JSON.stringify(lat),JSON.stringify(lon))
      console.log("latlong", lat, lon)
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
          &location_type=ROOFTOP&result_type=street_address&key=AIzaSyB73p4PDmuZmvTvR93FXQVXgfStWEz9XKM`

      fetch(url).then(response => response.json()).then(json => {
        console.log("location address=>", JSON.stringify(json));
        const formattedAddress = json.results[0].formatted_address
        const formattedAddressArray = formattedAddress.split(',')

        let locationJson = {

          lat: json.results[0].geometry.location.lat === undefined ? "N/A" : json.results[0].geometry.location.lat,
          lon: json.results[0].geometry.location.lng === undefined ? "N/A" : json.results[0].geometry.location.lng,
          address: formattedAddress === undefined ? "N/A" : formattedAddress

        }

        const addressComponent = json.results[0].address_components
        console.log("addressComponent", addressComponent)
        for (let i = 0; i <= addressComponent.length; i++) {
          if (i === addressComponent.length) {
            dispatch(setLocation(locationJson))

          }
          else {
            if (addressComponent[i].types.includes("postal_code")) {
              console.log("inside if")

              console.log(addressComponent[i].long_name)
              locationJson["postcode"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("country")) {
              console.log(addressComponent[i].long_name)

              locationJson["country"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("administrative_area_level_1")) {
              console.log(addressComponent[i].long_name)

              locationJson["state"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("administrative_area_level_3")) {
              console.log(addressComponent[i].long_name)

              locationJson["district"] = addressComponent[i].long_name
            }
            else if (addressComponent[i].types.includes("locality")) {
              console.log(addressComponent[i].long_name)

              locationJson["city"] = addressComponent[i].long_name
            }
          }

        }


        console.log("formattedAddressArray", locationJson)

      })
    })

    console.log("pointSharingDataDashboard",pointSharingData)
    if(pointSharingData)
    {
      const keys = Object.keys(pointSharingData?.point_sharing_bw_user.user)
      const values = Object.values(pointSharingData?.point_sharing_bw_user.user)
      const percentageKeys = Object.keys(pointSharingData?.point_sharing_bw_user.percentage)
      const percentageValues = Object.values(pointSharingData?.point_sharing_bw_user.percentage)
  
      let eligibleUser = ''
      let percentage;
      let index;
      for (var i = 0; i < values.length; i++) {
        if (values[i].includes(userData.user_type)) {
          eligibleUser = keys[i]
          index = percentageKeys.includes(eligibleUser) ? percentageKeys.indexOf(eligibleUser) : undefined
          const pointSharingPercent = percentageValues[index]
          // console.log(pointSharingPercent)
          console.log("On", userData.user_type, "scan", pointSharingPercent, "% Points would be shared with", eligibleUser)
          dispatch(setPercentagePoints(pointSharingPercent))
          dispatch(setShouldSharePoints())
  
        }
      }
    }
   

      const getDashboardData = async () => {
        try {
          // Retrieve the credentials
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            console.log(
              'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            const form_type = "2"
            console.log("token from dashboard ", token)
            token && getDashboardFunc(token)
            token && getKycStatusFunc(token)
            token && getBannerFunc(token)
            token && getWorkflowFunc({ userId, token })
            token && getFormFunc({ form_type, token })
           getMembership()
          } else {
            console.log('No credentials stored');
          }
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
      }
      getDashboardData()

     
   }, [focused]);
  
 
  
  
const fetchPointsHistory = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    console.log("userId", userId)
    const params = {
        userId: String(idUser),
        token: token
    }
    fetchUserPointsHistoryFunc(params)

}
  useEffect(() => {
    if (extraPointEntriesData) {
      console.log("extraPointEntriesData", extraPointEntriesData)

    }
    else if (extraPointEntriesError) {
      console.log("extraPointEntriesError", extraPointEntriesError)
    }
  }, [extraPointEntriesData, extraPointEntriesError])
  useEffect(() => {
        if (fetchUserPointsHistoryData) {
            console.log("fetchUserPointsHistoryData", JSON.stringify(fetchUserPointsHistoryData))


            if (fetchUserPointsHistoryData.success) {
        seScanningDetails(fetchUserPointsHistoryData?.body)
            }
        }
        else if (fetchUserPointsHistoryError) {
            console.log("fetchUserPointsHistoryError", fetchUserPointsHistoryError)
        }

    }, [fetchUserPointsHistoryData, fetchUserPointsHistoryError])

  

  useEffect(() => {
    if (getActiveMembershipData) {
      console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
      if(getActiveMembershipData.success)
      {
        setMembership(getActiveMembershipData.body?.tier.name)
      }
    }
    else if (getActiveMembershipError) {
      console.log("getActiveMembershipError", getActiveMembershipError)
    }
  }, [getActiveMembershipData, getActiveMembershipError])

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData)
      if (getKycStatusData.success) {
        const tempStatus = Object.values(getKycStatusData.body)
        
        setShowKyc(tempStatus.includes(false))

        dispatch(
          setKycData(getKycStatusData.body)
        )


      }
    }
    else if (getKycStatusError) {
      console.log("getKycStatusError", getKycStatusError)
    }
  }, [getKycStatusData, getKycStatusError])

  useEffect(() => {
    if (getDashboardData) {
      console.log("getDashboardData", getDashboardData)
      setDashboardItems(getDashboardData.body.app_dashboard)
    }
    else if (getDashboardError) {
      console.log("getDashboardError", getDashboardError)
    }
  }, [getDashboardData, getDashboardError])

  

  
  
 



  useEffect(() => {
    if (getBannerData) {
      console.log("getBannerData", getBannerData.body)
      const images = Object.values(getBannerData.body).map((item) => {
        return item.image[0]
      })
      console.log("images", images)
      setBannerArray(images)
    }
    else {
      console.log(getBannerError)
    }
  }, [getBannerError, getBannerData])

  // ozone change

  useEffect(() => {
    if (getWorkflowData) {
      if (getWorkflowData.length === 1 && getWorkflowData[0] === "Genuinity") {
        dispatch(setIsGenuinityOnly())
      }
      const removedWorkFlow = getWorkflowData.body[0]?.program.filter((item, index) => {
        return item !== "Warranty"
      })
      console.log("getWorkflowData", getWorkflowData)
      dispatch(setProgram(removedWorkFlow))
      dispatch(setWorkflow(getWorkflowData.body[0]?.workflow_id))

    }
    else {
      console.log(getWorkflowError)
    }
  }, [getWorkflowData, getWorkflowError])
  useEffect(() => {
    if (getFormData) {
      console.log("Form Fields", getFormData.body)
      dispatch(setWarrantyForm(getFormData.body.template))
      dispatch(setWarrantyFormId(getFormData.body.form_template_id))

    }
    else {
      console.log("Form Field Error", getFormError)
    }
  }, [getFormData, getFormError])

  const platformMarginScroll = Platform.OS === 'ios' ? 0 : 0

  const getMembership = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
      getActiveMembershipFunc(token)
    }
  }

  const hideSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const showSuccessModal = () => {
    setIsSuccessModalVisible(true);
    console.log("hello")
  };

  

  return (
    <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: "#F7F9FA", flex: 1, height: '100%' }}>
     
      
      <ScrollView style={{ width: '100%', marginBottom: platformMarginScroll, height: '100%' }}>
      <DrawerHeader></DrawerHeader>
      <View style={{width:'100%',alignItems:'center',justifyContent:'flex-start',flexDirection:'row',marginBottom:10}}>
      <PoppinsTextLeftMedium style={{color:ternaryThemeColor, fontWeight:'bold', fontSize:19,marginLeft:20}} content={`Welcome ${userData?.name}`}></PoppinsTextLeftMedium>
      {getActiveMembershipData?.body!==null && <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:10
              }}>
                 <TouchableOpacity style={{alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:ternaryThemeColor,padding:4,borderRadius:4}} onPress={
                showSuccessModal
              }>
              <Image
                style={{ height: 16, width: 16, resizeMode: 'contain', }}
                source={require('../../../assets/images/reward.png')}></Image>
             
                <PoppinsTextMedium
                  style={{ color: 'white', fontSize: 14 }}
                  content={membership}></PoppinsTextMedium>
              </TouchableOpacity>

            </View>}
            <PlatinumModal isVisible={isSuccessModalVisible} onClose={hideSuccessModal} getActiveMembershipData={getActiveMembershipData} />

      </View>
        <View style={{ width: '100%', alignItems: "center", justifyContent: "center", height: "90%" }}>
          <View style={{ height: 200, width: '100%', marginBottom: 20 }}>
            {bannerArray &&
              <Banner images={bannerArray}></Banner>
            }

            {/* <CampaignVideoModal isVisible={CampainVideoVisible} onClose={()=>{
              setCmpainVideoVisible(false)
            }} /> */}
          </View>
         {/* Ozone specific change do not show for sales */}
         {
            userData.user_type_id !== 13 && 
            <View style={{ width: "90%", height: 50, backgroundColor: 'white', marginBottom: 20, flexDirection: 'row', alignItems: 'center', borderColor: '#808080', borderWidth: 0.3, borderRadius: 10 }}>

            <View style={{ backgroundColor: 'white', width: '42%', marginHorizontal: 20 }}>
             {
             <PoppinsText content={`Balance Points ${userPointData?.body?.point_balance ? userPointData?.body?.point_balance : ": 0"}`}
              style={{ color: 'black', fontWeight: 'bold' }}></PoppinsText> } 
            </View>

            <View style={{ height: '100%', borderWidth: 0.4, color: "#808080", opacity: 0.3, width: 0.2 }}>
            </View>

            {!userPointIsLoading && <View style={{ backgroundColor: 'white', paddingLeft: '8%' }}>
              <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, padding: 10, borderRadius: 5, width: 120, alignItems: 'center' }} onPress={() => { navigation.navigate("RedeemedHistory") }}>
                <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800' }} content="Redeem"  ></PoppinsTextLeftMedium>
</TouchableOpacity>
            </View>}

          </View>
          }
               {scanningDetails && scanningDetails?.data.length!==0 &&  <ScannedDetailsBox lastScannedDate={moment(scanningDetails?.data[0]?.created_at).format("DD MMM YYYY")} scanCount={scanningDetails.total}></ScannedDetailsBox>}

          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 4 }}>
            {/* <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox>
          <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox> */}

          </ScrollView>
          
           
          {dashboardItems && !userPointIsLoading && <DashboardMenuBox navigation={navigation} data={dashboardItems}></DashboardMenuBox>}
        
          {
        userPointIsLoading && <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      }
          <View style={{ width: '100%', alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            {showKyc && <KYCVerificationComponent buttonTitle="Complete Your KYC" title="Your KYC is not completed"></KYCVerificationComponent>}
          </View>
          {/* social links */}
          <View style={{alignItems:'center',justifyContent:'flex-end',flexDirection:'row',width:'90%',marginBottom:4}}>
         
          {showLink && <View style={{alignItems:'center',justifyContent:'space-evenly', width:'85%',height:60,flexDirection:'row',marginBottom:10}}>
            
               <TouchableOpacity onPress={()=>{
                Linking.openURL('https://www.facebook.com/HarshitaLeggings/')
                }
                }>
                <Facebook name="facebook-square" size={40} color="blue"></Facebook> 
    
                </TouchableOpacity>
       
           
            <TouchableOpacity onPress={()=>{
            Linking.openURL('https://www.hirshita.com/?fbclid=IwAR3_IGHfXqw-8qujD6qpcXRXtI4xsXeH-bwKnLc3WFKlkjgYsjvIuk_WvoY')
            }
            }>
              <View style={{height:50,width:50,backgroundColor:'#DDE8EE',alignItems:'center',justifyContent:'center',borderRadius:25}}>
          <Image style={{height:50,width:50}} resizeMode='contain' source={require('../../../assets/images/hirshitaSquirrel.png')}></Image>
              </View>
              
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
            Linking.openURL('https://londondream.in/')
            }
            }>
              <View style={{height:50,width:50,backgroundColor:'#DDE8EE',alignItems:'center',justifyContent:'center',borderRadius:25}}>
          <Image style={{height:50,width:50}} resizeMode='contain' source={require('../../../assets/images/LondonDreamsIcon.png')}></Image>
              </View>
              
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{
            Linking.openURL('https://www.instagram.com/harshita_leggings/')
            }
            }>
          <Instagram name="instagram" size={40} color="red"></Instagram> 
              
              </TouchableOpacity>

          </View>}
          <TouchableOpacity style={{width:'15%',marginBottom:10}} onPress={()=>{setShowLink(!showLink)}}>
            <View style={{backgroundColor:ternaryThemeColor,width:50,height:50,borderRadius:25,alignItems:'center',justifyContent:'center'}}>
            <Link name="sharealt" color={"white"} size={30}></Link>
            </View>
          </TouchableOpacity>
          </View>
          
          {/* --------------------- */}
          {(userData.user_type).toLowerCase()!=="dealer" && (userData.user_type).toLowerCase()!=="sales" &&<View style={{ flexDirection: "row", width: '100%', alignItems: "center", justifyContent: "center",marginBottom:30 }}>
            <DashboardSupportBox text="Rewards" backgroundColor="#D9C7B6" borderColor="#FEE8D4" image={require('../../../assets/images/reward_dashboard.png')} ></DashboardSupportBox>
            <DashboardSupportBox text="Customer Support" backgroundColor="#BCB5DC" borderColor="#E4E0FC" image={require('../../../assets/images/support.png')} ></DashboardSupportBox>
            <DashboardSupportBox text="Feedback" backgroundColor="#D8C8C8" borderColor="#FDDADA" image={require('../../../assets/images/feedback.png')} ></DashboardSupportBox>

          </View>}
          
           
        </View>
       
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({})

export default Dashboard;