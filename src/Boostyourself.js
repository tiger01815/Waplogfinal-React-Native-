import React, { Component } from 'react'
import Carousel from 'react-native-banner-carousel';
import { config } from './Provider/configProvider';
import { localStorage } from './Provider/localStorageProvider';
import { msgProvider, msgTitle, msgText } from './Provider/messageProvider';
import Loader from './Loader';
import NetInfo from '@react-native-community/netinfo';
import { Text, View, FlatList, TouchableOpacity,ScrollView, Image, StyleSheet, Dimensions, TextInput, ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import Colorss from './Colorss'
import {Nodata_found} from './Nodata_found';
import { apifuntion } from './Provider/apiProvider';
import { Lang_chg } from './Provider/Language_provider';
export default class Boostyourself extends Component {
    constructor(props) {
        super(props);
        this.state = {
                  loading:false,
                  isConnected:false,
                  boost_arr:'NA',
                  slider_arr:'NA',
                  boost_staus_me:0,
                  title_content_arr:'NA',
                  boost_id:0,
                  data: [{
                    id: '0',
                    image: require('./icons/salini.png'),
                    amount: '$500.00',
                    status: true
                },
                {
                    id: '1',
                    image: require('./icons/elish.png'),
                    amount: '$500.00',
                    status: false
                },
                {
                    id: '2',
                    image: require('./icons/salini.png'),
                    amount: '$500.00',
                    status: false
                },
                {
                    id: '4',
                    image: require('./icons/salini.png'),
                    amount: '$500.00',
                    status: false
                },
    
                ]
           }
    }

    componentDidMount(){  
        NetInfo.fetch().then(state => {
             this.setState({isConnected:state.isConnected}) });
             const unsubscribe = NetInfo.addEventListener(state=>{
             this.setState({isConnected:state.isConnected})
           });  
          this.getallboostdata()
  }
  getallboostdata = async() => {
         console.log('getallboostdata')
         let userdata=await localStorage.getItemObject('user_arr')
         let user_id=userdata.user_id
          if(this.state.isConnected==true)
             {
               this.setState({loading:true});

              let url = config.baseURL+"get_all_boost.php?user_id="+user_id
           console.log(url)
          apifuntion.getApi(url).then((obj) => {
             this.setState({loading:false});
             console.log('obj', obj);
             return obj.json();
           }).then((obj) => {
               console.log('obj',obj)
              if (obj.success == "true") {
                
                
                 this.setState({boost_arr:obj.boost_arr,slider_arr:obj.slider_arr,boost_staus_me:obj.boost_staus_me,title_content_arr:obj.title_content_arr})
                     // localStorage.setItemObject('user_arr',obj.user_details)
                     // this.props.navigation.goBack()
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

     buybecomevip=async()=>{
        console.log('buybecomevip')
        let userdata=await localStorage.getItemObject('user_arr')
        let user_id=userdata.user_id
         if(this.state.boost_id==0)
           {
             msgProvider.toast(Lang_chg.validationbecomevip[config.language],'center')
             return false
            }
          if(this.state.isConnected==true)
            {
             this.setState({loading:true});

            let url = config.baseURL+"add_user_boost.php?user_id="+user_id+'&boost_id='+this.state.boost_id
             console.log(url)
            apifuntion.getApi(url).then((obj) => {
            this.setState({loading:false});
            console.log('obj', obj);
            return obj.json();
          }).then((obj) => {
              console.log('obj',obj)
             if (obj.success == "true") {
                 if(obj.status==1)
                 {
                    this.finalpayment(obj.event_id_get,obj.amount,user_id)
                 }
                  // localStorage.setItemObject('user_arr',obj.user_details)
                    // this.props.navigation.goBack()
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
    finalpayment=(become_vip_id,amount,user_id)=>{
        if(this.state.isConnected==true)
        {
         this.setState({loading:true});
         let url = config.baseURL+"paypal/paypal_payment_url.php?user_id="+user_id+'&event_id='+become_vip_id+'&amount='+amount+'&currency=USD&payment_type=2';
         console.log(url)
         apifuntion.getApi(url).then((obj) => {
         this.setState({loading:false});
         console.log('obj', obj);
        return obj.json();
      }).then((obj) => {
          console.log('obj',obj)
         if (obj.success == "true") {
            this.props.navigation.navigate('Paypalpayment',{'url_paypal':obj.data.links[1].href,})
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

    Selectcard=(item,index)=>{
        console.log('this.state.boost_status_me',this.state.boost_arr)
        // if(this.state.boost_staus_me==0)
        // {
        let data=this.state.boost_arr
        if(data[index].status==true)
           {
              data[index].status=false
              this.setState({boost_arr:data,boost_id:0})
           }
          else{
               for(let i=0; i<data.length; i++)
               {
                if(i==index)
                 {
                    data[i].status=true
                 }
               else{
                   data[i].status=false
               }
             }
             this.setState({boost_arr:data,boost_id:item.boost_id})
            }
        
    //    }
   }

    renderitemhorizontal = ({ item,index }) => {
        if(this.state.boost_arr!='NA')
        {
        console.log('titleee-', item)
        let txtcolor = '';
        let bgcolor = '';
        { item.status ? txtcolor = Colorss.whiteColor : txtcolor = Colorss.gray }
        { item.status ? bgcolor = Colorss.goldcolor : bgcolor = '#d6d6d6' }
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{this.Selectcard(item,index)}}>
            <View style={{ alignItems:'center',  backgroundColor: 'white', width: 120,  borderRadius: 10, marginHorizontal: 5, marginVertical: 8,paddingBottom:5 }}>
               <View style={{marginTop:25,alignSelf:'center', borderColor: 'green', borderWidth: 0, alignItems: 'center', justifyContent: 'center', }}>
                {/* <Text style={{  fontFamily: 'Piazzolla-Bold', fontSize: 14, color:Colorss.greyColor, }}>1 Month</Text> */}
                  
                    <Text style={{alignSelf:'center',textAlign:'center', fontFamily:'Piazzolla-Bold',fontSize:13,color:'#5f6061'}}>{item.description[config.language]}</Text>
                    {/* <Text style={{ alignSelf: 'center', fontSize: 24, fontFamily: 'Piazzolla-Bold', marginTop: 1, color: Colorss.goldcolor }}>+</Text> */}
                    <Text style={{ alignSelf: 'center', fontSize: 15,  fontFamily: 'Piazzolla-Bold', marginTop: 1 ,color:'#5f6061'}}>{item.no_of_boost} {Lang_chg.boost_key[config.language]}</Text>


                </View>
                <View style={{ marginTop:10, alignItems: 'center', backgroundColor:bgcolor, width: 100, height: 35, justifyContent: 'center', borderRadius: 15 }}>

                    <Text style={{  fontFamily: 'Piazzolla-Bold', fontSize: 16, color: txtcolor }}>${item.amount}</Text>
                </View>


            </View>
            </TouchableOpacity>
        )
        }
    }
    backpress = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{flex:1, width: '100%', backgroundColor: Colorss.whiteColor }}>
               <Loader loading={this.state.loading}/>
               <ScrollView showsVerticalScrollIndicator={false} >
               <View style={{ flexDirection: 'row', marginLeft: 20, height:50,alignItems:'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={()=>{this.backpress()}} style={{width:30,height:30,alignItems:'center',justifyContent:'center'}}>
                        <Image style={{  resizeMode: 'contain',  width: 20, height: 15, alignSelf: 'center'}} source={require('./icons/coin_close.png')}></Image>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18,  fontFamily: 'Piazzolla-Bold' }}>{Lang_chg.boosttitle[config.language]}</Text>
                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>

                           
                        </View>
                    </View>
                    <LinearGradient style={{borderTopLeftRadius: 25, borderTopRightRadius: 25,  width: '100%', height: '100%',paddingBottom:50}} colors={Colorss.basecolor1}>
                <View style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25,  borderWidth:0,  width: '100%',  }} >
                {this.state.slider_arr!='NA' &&  <View style={{paddingBottom: 25,  marginTop: 10, borderRadius: 0, borderWidth: 0, borderColor: 'green',  width: '100%' }}>
                        <Carousel
                            style={{}}
                            autoplay
                            autoplayTimeout={5000}
                            loop
                            index={0}

                        >
                            {this.state.slider_arr.map((item, index) => (
                                <View style={{ paddingBottom: 30, paddingTop: 30, borderColor: 'green', borderWidth: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 15, alignSelf: 'center', backgroundColor: Colorss.whiteColor, width: '95%',  }}>
                                    <Image style={{width:80,height:80,resizeMode:'contain'}} source={require('./icons/boost_your_self.png')}></Image>
                                    {/* <Text style={{  fontFamily: 'Piazzolla-Bold', fontSize: 20, }}>Be the Top profile in your area </Text> */}
                                    {/* <Text style={{textAlign:'center', fontSize: 16, fontFamily: 'Piazzolla-Regular' }}>See who like you ,visit your profile and read your messages</Text> */}
                                    <Text style={{ fontFamily: 'Piazzolla-Bold', fontSize: 22, }}>{item.title[config.language]}</Text>
                                        <Text style={{textAlign:'center', fontSize: 16, fontFamily: 'Piazzolla-Regular' }}>{item.description[config.language]}</Text>
                                    {/* <Text style={{  fontSize: 16, fontFamily: 'Piazzolla-Regular' }}>Vip member get 85% more view</Text> */}
                                </View>)
                            )}
                        </Carousel>
                    </View>}
                    <View style={{ borderColor: 'white', borderWidth: 0,  }}>
                     {this.state.boost_arr=='NA' && 
                          <Nodata_found/>    
                       }
                        <FlatList style={{}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.boost_arr}
                            renderItem={this.renderitemhorizontal}
                            keyExtractor={(item, index) => index.toString()}
                        ></FlatList>
                    </View>
                    <View style={{alignSelf:'center', marginTop: 30, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colorss.whiteColor, width: '95%',  }}>
                        <TouchableOpacity onPress={()=>{this.buybecomevip()}} style={{ borderRadius: 12, justifyContent: 'center', borderWidth: 0, borderColor: 'green', backgroundColor: Colorss.whiteColor, width: '100%', height: 50 }}>
                            <Text style={{ alignSelf: 'center', fontSize: 16,  fontFamily: 'Piazzolla-Bold', color: Colorss.gray }}>{Lang_chg.boostbuynow[config.language]}</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.title_content_arr!='NA' && <View style={{ paddingHorizontal: '4%', marginTop: 5, width: '95%',paddingBottom:20 }}>
                            <Text style={{ marginTop: 10, fontSize: 15, fontFamily: 'Piazzolla-Bold', color: Colorss.whiteColor }}>{this.state.title_content_arr.title[config.language]}</Text>
                            <Text style={{ fontSize: 10, color: Colorss.whiteColor, fontFamily: 'Piazzolla-Regular' }}>{this.state.title_content_arr.description[config.language]}</Text>
                        </View>}
                </View>
                </LinearGradient>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    wrapper: {},
    backimg: {
        resizeMode: 'contain',
        width: 18,
        height: 25

    },
    txtinput: {
        paddingLeft: 20, marginTop: 20, borderRadius: 10, height: 50, borderColor: 'gray', borderWidth: 1
    },
    chip: {
        borderColor: 'white',
        backgroundColor: 'red', width: '30%'
    }, selectchip: {
        borderColor: 'red',
        backgroundColor: 'white', borderWidth: 1, width: '30%'
    },

})