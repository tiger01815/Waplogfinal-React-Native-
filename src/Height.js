import React, { Component } from 'react'
import { Text, StyleSheet, ScrollView,FlatList, ImageBackground, View, Image, TouchableOpacity, TextInput } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { ProgressBar, Colors, Checkbox } from 'react-native-paper';
import { config } from './Provider/configProvider';
import { localStorage } from './Provider/localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import {Lang_chg} from './Provider/Language_provider'
import { apifuntion } from './Provider/apiProvider';
import NetInfo from '@react-native-community/netinfo';
import Colorss from './Colorss';
import Icon from 'react-native-vector-icons/Fontisto'
export default class Height extends Component {
    constructor(props){
        super(props)
        this.state={
            height_arr:this.props.route.params.height_arr,
            id:'',
            isConnected:true,
            loading:false,
            image:this.props.route.params.image,
        }
    }
    componentDidMount()
    {
        this.props.navigation.addListener('focus', () => {
            this.userdata1()
          });
      
    }
    userdata1=async()=>{
        let userdata=await localStorage.getItemObject('user_arr')
      
        let data=this.state.height_arr
        let id=''
         for(let i=0; i<data.length; i++)
         {
             if(data[i].height_id==userdata.height_id)
             {
                
                data[i].status=true
                id=data[i].height_id
             }
             else{
                data[i].status=false
             }
         }
         this.setState({height_arr:data,id:id})
    }
    useralldetaile = async() => {
     let userdata=await localStorage.getItemObject('user_arr')
     let user_id=userdata.user_id
     if(this.state.id.length<=0)
     {
         msgProvider.toast(Lang_chg.validationheiht[config.language],'center')
         return false
     }
     if(this.state.isConnected==true)
     {
        this.setState({loading:true});
       let url = config.baseURL+"edit_user_otherdetail.php"
       console.log(url)
       let data=new FormData()
       data.append('user_id',user_id)
       data.append('edit_type','height')
       data.append('edit_text',this.state.id)
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
      selectcolor=(index)=>{
         
          let data=this.state.height_arr
            for(let i=0; i<data.length; i++)
            {
                if(index==i)
                {
                
                    data[i].status=true
                }
                else{
                    data[i].status=false
                }
            }
            this.setState({height_arr:data,id:data[index].height_id})
            console.log('data',data)
      }
      clearselection=()=>{
         let data=this.state.height_arr
         for(let i=0; i<data.length; i++)
         {
             data[i].status=false
         }
         this.setState({height_arr:data,id:''}) 
      }
   

   
      renderitem = ({ item,index }) => {
          console.log('item',item)
        if(this.state.height_arr!='NA')
        {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.selectcolor(index)}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center', borderRadius: 10, borderColor: 'white', borderWidth: 1, paddingHorizontal: 15, marginVertical: 9,width:'100%', height: 52 }}>
                    <View >
                       {item.status==false &&  <Icon name='checkbox-passive' size={18} color='#FFFFFF' style={{alignSelf:'center'}}/>}
                       {item.status==true &&  <Icon name='checkbox-active' size={18} color='#FFFFFF' style={{alignSelf:'center'}}/>}
                    </View>
                    <View>
                        <Text style={{marginRight:25, alignSelf: 'center', fontFamily:'Piazzolla-Bold', color: 'white', fontSize: 16 }}>{item.height} cm</Text>

                    </View>
                    <View></View>



                </View>
            </TouchableOpacity>)
        }
    }
   
    backpress=()=>{
        this.props.navigation.goBack()
      }
    render() {
        return (
          
            <View style={{flex:1}}>
            <Loader loading={this.state.loading}/>
                 <ScrollView style={{width:'95%',alignSelf:'center'}} showsVerticalScrollIndicator={false}>
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
                        <ProgressBar style={{ height: 5 }} progress={0.5} color={Colorss.red} />

                    </View>
                </View>
                <View style={{borderRadius: 20,  width: '100%',  }}>
                <LinearGradient style={{ marginTop: 5, paddingHorizontal: 10, borderRadius: 20,  width: '100%',  }} colors={Colorss.basecolor}>
                    <View style={{ marginTop: 5 }}>
                    <TouchableOpacity onPress={()=>{this.useralldetaile()}}>
                    <Text style={{  fontSize: 16, fontFamily:'Piazzolla-Bold', color: 'white',width:120,height:30 }}>{Lang_chg.Save[config.language]}</Text>
                    </TouchableOpacity> 
                        <Text style={{ right: 0, position: 'absolute', fontSize: 16, fontFamily:'Piazzolla-Bold', color: 'white' }}>5/10</Text>
                        <Image style={{ marginTop: 22, alignSelf: 'center', height: 35, width: 35, resizeMode: 'contain' }} source={require('./icons/heightw.png')}>
                        </Image>
                        <Text style={{ marginTop: 10, alignSelf: 'center', fontSize: 22, fontFamily:'Piazzolla-Bold', color: 'white' }}>{Lang_chg.titleheight[config.language]}</Text>
                    </View>
                    <View style={{marginTop:50}}>
                    {this.state.height_arr=='NA' &&
                     <View style={{alignContent:'center',alignSelf:'center',alignItems:'center',marginTop:20}}>
                       <Image source={require('./icons/no_found.png')} style={{width:150,height:150,alignSelf:'center',}}/>
                    </View>
                     }
                        <FlatList
                            data={this.state.height_arr}
                            renderItem={this.renderitem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.clearselection()}}>
                    <View style={{ alignSelf: 'center',marginTop:35, paddingBottom:15,width:'100%',alignItems:'center'}}>
                        <Text  style={{marginLeft:10,   fontSize: 16, fontFamily:'Piazzolla-Bold', color: 'white' }}>{Lang_chg.Clear[config.language]} </Text>
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
