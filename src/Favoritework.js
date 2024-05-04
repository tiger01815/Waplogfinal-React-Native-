import React, { Component } from 'react'
import { Text, StyleSheet, FlatList, ImageBackground,ScrollView, View, Image, TouchableOpacity, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { apifuntion } from './Provider/apiProvider';
import { ProgressBar, Colors, Checkbox } from 'react-native-paper';
import { config } from './Provider/configProvider';
import { localStorage } from './Provider/localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import {Lang_chg} from './Provider/Language_provider'
import NetInfo from '@react-native-community/netinfo';
import { Keyboard } from 'react-native';
export default class Favoritetvshow extends Component {

    state = {
        work:'',
        loading:false,
        isConnected:true,
        image:this.props.route.params.image,
       
    }
    componentDidMount(){ 
        NetInfo.fetch().then(state => {
            this.setState({isConnected:state.isConnected}) });
            const unsubscribe = NetInfo.addEventListener(state=>{
            this.setState({isConnected:state.isConnected})
          });  
        this.props.navigation.addListener('focus', () => {
            this.userdata1()
          });
     }
    userdata1=async()=>{
        let userdata=await localStorage.getItemObject('user_arr')
        if(userdata.work!='NA')
        {
            this.setState({work:userdata.work})
        }
        }
       
         
    useralldetaile = async() => {
        let userdata=await localStorage.getItemObject('user_arr')
        let user_id=userdata.user_id
        if(this.state.work.length<=0)
        {
            msgProvider.toast(Lang_chg.validationwork[config.language],'center')
            return false
        }
        if(this.state.isConnected==true)
        {
           this.setState({loading:true});
          let url = config.baseURL+"edit_user_otherdetail.php"
          console.log(url)
          let data=new FormData()
          data.append('user_id',user_id)
          data.append('edit_type','work')
          data.append('edit_text',this.state.work)
          apifuntion.postApi(url,data).then((obj) => {
            this.setState({loading:false});
            console.log('obj', obj);
            return obj.json();
          }).then((obj) => {
              console.log('obj',obj)
             if (obj.success == "true") {
                    localStorage.setItemObject('user_arr',obj.user_details)
                    this.props.navigation.goBack()
                } else {
               msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
               return false;
             }
           }).catch((error) => {
             console.log("-------- error ------- " + error);
             this.setState({ loading: false });
           });
       }
       else{
           msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
       }
    }
   

    renderitem = ({ item }) => {
        return (
            <View>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center', borderRadius: 10, borderColor: 'white', borderWidth: 1, paddingHorizontal: 15, marginVertical: 10,width:'100%', height: 52 }}>
                    <View style={{}}><Checkbox style={{}}
                        uncheckedColor='#ffffff'
                        status={item.status}
                    ></Checkbox></View>
                    <View>
                        <Text style={{ alignSelf: 'center', fontWeight: 'bold', color: 'white', fontSize: 16 }}  >{item.color}</Text>

                    </View>
                    <View></View>



                </View>
            </View>)
    }

    backpress=()=>{
        this.props.navigation.goBack()
      }
    render() {
        return (
            <View style={{flex:1}}>
            <Loader loading={this.state.loading}/>
            <ScrollView style={{width:'90%',alignSelf:'center'}} showsVerticalScrollIndicator={false} keyboardDismissMode='on-drag' keyboardShouldPersistTaps='always'>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TouchableOpacity onPress={() => { this.backpress() }} style={{  width: 30, height: 30,alignItems:'center',justifyContent:'center' }}>
                    <Image style={styles.backimg} source={require('./icons/add_crosb.png')}></Image>
                  </TouchableOpacity>
                    <View style={{ position: 'absolute', right: 5, width: 45, height: 45, justifyContent: 'center', alignSelf: 'center', }}>
                        <ImageBackground imageStyle={{ borderRadius: 20 }} style={{ width: 40, height: 40, resizeMode: 'contain' }} source={this.state.image=='NA'?require('./icons/new.png'):{uri:config.img_url+this.state.image[0].image_name}}>
                        </ImageBackground>
                    </View>

                </View>
                <View style={{ paddingVertical: 30 }}>
                    <View style={{ width: '100%', }}>
                        <ProgressBar style={{ height: 5 }} progress={0.5} color={Colors.red800} />

                    </View>
                </View>
                <View style={{  borderRadius: 20, borderColor: 'white', borderWidth:0, width: '100%',  }}>
                <LinearGradient style={{ marginTop: 5, paddingHorizontal: 10, borderRadius: 20,  width: '100%', }} colors={Colorss.basecolor}>
                
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ right: 0, position: 'absolute', fontSize: 16, fontWeight: 'bold', color: 'white' }}>1/2</Text>
                        <Image style={{ marginTop: 22, alignSelf: 'center', height: 35, width: 35, resizeMode: 'contain' }} source={require('./icons/workw.png')}>
                        </Image>
                        <Text style={{ marginTop: 10, alignSelf: 'center', fontSize: 24, fontWeight: 'bold', color: 'white' }}>{Lang_chg.titlework[config.language]}</Text>
                    </View>
                    <View style={{marginTop:40}}>

                    <View style={{flexDirection:'row', borderRadius: 10, borderColor: 'white', borderWidth: 1, paddingHorizontal: 15, marginVertical: 10,width:'100%', height: 55 }}>
                   <TextInput 
                   placeholder={Lang_chg.enterwork[config.language]}
                   placeholderTextColor='#FFFFFF'
                   keyboardType='default'
                   returnKeyLabel='done'
                   returnKeyType='done'
                   maxLength={50}
                   onSubmitEditing={()=>{Keyboard.dismiss()}}
                   onChangeText={(txt)=>{this.setState({work:txt})}}
                   value={this.state.work}
                   style={{width:'85%',color:'white',fontSize:15}}>

                   </TextInput>
                   <TouchableOpacity style={{ fontSize:16,color:'white',fontFamily:'Piazzolla-Bold',position:'absolute',right:20,alignSelf:'center'}} onPress={()=>{this.useralldetaile()}}>
                   <Text style={{ fontSize:16,color:'white',fontFamily:'Piazzolla-Bold',}}>{Lang_chg.Save[config.language]}</Text>
                   </TouchableOpacity>

                </View>
                        {/* <FlatList
                            data={this.state.data}
                            renderItem={this.renderitem}
                            keyExtractor={(item, index) => index.toString()}
                        /> */}
                        </View>
                       
                    <TouchableOpacity activeOpacity={0.9}   onPress={()=>{this.props.navigation.goBack()}}>
                    <View style={{ alignSelf: 'center',paddingTop:20,paddingBottom:20}}>
                        <Text  style={{fontSize: 16, fontFamily:'Piazzolla-Bold',color:'white'}}>{Lang_chg.Skip[config.language]}</Text>
                    </View>
                    </TouchableOpacity>
</LinearGradient>
                </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    backimg: {
        resizeMode: 'contain',
        width: 18,
        height: 25

    },
    txtinput: {
        paddingLeft: 20, marginTop: 20, borderRadius: 10, height: 50, borderColor: 'gray', borderWidth: 1
    }
})
