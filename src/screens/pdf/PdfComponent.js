import React,{useEffect} from 'react';
import { StyleSheet, Dimensions, View,BackHandler} from 'react-native';
import Pdf from 'react-native-pdf';
import { BaseUrlImages } from '../../utils/BaseUrlImages';

const PdfComponent = ({route,navigation}) => {
    const pdf = route.params.pdf
    const pdfLink = BaseUrlImages+pdf
    const source = { uri: pdfLink, cache: true };
    
    useEffect(()=>{
        return () =>BackHandler.removeEventListener()
    },[])
    return (
        <View style={styles.container}>
                <Pdf

                trustAllCerts={false}
                    source={source}
                    onLoadComplete={(numberOfPages,filePath) => {
                         BackHandler.addEventListener('hardwareBackPress', ()=>{
                            navigation.goBack()
                        })
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default PdfComponent;
