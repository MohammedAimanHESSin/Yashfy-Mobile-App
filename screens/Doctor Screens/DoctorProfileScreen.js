import React, { useState } from "react";
import {
  View,
  // Text,
  Button,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
  TextInput,
} from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
// import AvaialbleAppointmentsList from "../../components/AvaialbleAppointmentsList";
import ReviewsList from "../../components/ReviewsList";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import StarRating from "react-native-star-rating";
import DatePicker from "react-native-datepicker";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Collapsible from "react-native-collapsible";
import Tags from "react-native-tags";

import axios from "axios";  
//const baseUrl = "https://test-api-yashfy.herokuapp.com"; // production 
const baseUrl = "http://192.168.1.12:8080"; //Devolopment

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';



const DoctorProfileScreen = ( /*token*/) => {

  
const fetchDoctorDataHandle = async ( token) => {

    //CALLING API RETURN data 
    try {
      console.log(" ....... Calling API (Fetch Doctor data)......")
      const response = await axios.get(`${baseUrl}/doctors/profile`, {
        headers: {
          'Authorization': `bearer ${token}` 
        }
      });
  
      // { url , body , headear , config } for maore deatils visit docs
      if (response.status === 200) {
       // console.log(` Response: ${JSON.stringify(response.data)}`);
        console.log(` Doctor data is fetched`);
        // Set the data with fetched data
        return response.data.doctor    
        } 
      else
      {
        Alert.alert('Not Found !', 'Seems that this doctor is not found !', [
          {text: 'Try Again'}
       ]);
        return null;
      }
    }
     catch (error) {
      setLoading(false);
      setRefreshing(false)
      alert("An error has occurred in fetching doctor data ..");
      console.log(error);
      throw error;
    }
  }

const submitEditHandle = async (submission) => {
      setfetchapi(true);

      //CALLING API RETURN TOKEN
      try {
        console.log(" Calling API ....")
        const response = await axios.post(`${baseUrl}/doctors/edit-profile`, submission);
        if (response.status === 200) {
          setfetchapi(false);
          Alert.alert('Done', 'Successfuly Logged In.', [
            {text: 'Okay'}
          ]);
          console.log(` Response: ${JSON.stringify(response.data)}`);
          //call sign in function from authcontext JS object imported
  
          signIn(response.data);
          navigation.navigate("HomeScreen");  // This should be removed , the sigIn( ) in the previous line is enough.      
        } 
        else
        {
          setfetchapi(false);
          Alert.alert('Not Found User!', 'Username or password is incorrect.', [
            {text: 'Okay'}
         ]);
          return;
        }
      }
       catch (error) {
        setfetchapi(false);
        alert("An error has occurred");
        console.log(error);
        console.log("Status code" , response.status);
        throw error;
      }
  }
const intialState= {
    username: " ",
    email: " ",
    first_name: " ",
    last_name: " ",
    phone_number: " ",
    date_of_birth: " ",
    specialization:" ",
    consultaion_fee:0,
    region: ' ',
    city: " ",
    hospital:" ",
    hospital_id: null,
    qualification_name: " ",
    institute_name: " ",
    procurement_year: " ",
    staff_rating: 0,
    clinic_rating: 0,
    doctor_treatment_rating: 0,
    waiting_time_rating: 0,
    equipement_rating: 0,
    price_rating: 0,
  }
const [data, setData] = useState(intialState);  
const [token, setToken] = React.useState(null);


let submission = {
    first_name: data.first_name,
    last_name: data.last_name,
    city: data.city,
    specialization: data.specialization,
    consultaion_fee: data.consultaion_fee,
    phone_number: data.phone_number,
    date_of_birth: data.date_of_birth.split("-").reverse().join("-"),
    region: data.region,
    hospital_id: parseInt(data.hospital_id, 10),
    qualifications: [
      {
        qualification_name: data.qualification_name,
        institute_name: data.institute_name,
        procurement_year: data.procurement_year.split("-").reverse().join("-"),
      },
    ],
    // street_address: data.street_address,
    // country: data.country,
    // insurance_id: data.insurance,
  };  

  
useFocusEffect(
    React.useCallback(() => {
      // reset Fields before fetching it 
      setFieldsEditable(false)
      setData(intialState)  
       // Fetch Token
       AsyncStorage.multiGet(['userToken','isDoctor']).then(res =>
        {
          setToken(res[0][1]);
           // Fetch All Data
          const promise = fetchDoctorDataHandle(res[0][1]);
          promise.then(doctorData => {
            //let insurance = InsurancesItems.find( ({ id }) => id === patientData.insuranceId );
            console.log("DATA: ",doctorData)
            setData(
              {
                ...data,
                username: doctorData.username,
                email: doctorData.email,
                first_name: doctorData.first_name,
                last_name : doctorData.last_name,
                date_of_birth: doctorData.date_of_birth.split("-").reverse().join("-"),
                city: doctorData.city,
                phone_number: doctorData.phone_num,
                consultaion_fee: doctorData.consultaion_fee,
                region: doctorData.region,
                staff_rating: doctorData.catgs_staff,
                clinic_rating: doctorData.catgs_Clinic,
                doctor_treatment_rating: doctorData.catgs_doctor_treatment,
                waiting_time_rating: doctorData.catgs_waiting_time,
                equipement_rating:doctorData.catgs_equipment,
                price_rating:doctorData.catgs_price,

                //insurance_id:patientData.insuranceId,
                //insurance: insurance.value
              }
            )
          });

        }
      ).catch(err=>{
        console.log(err)
      })

    }, [])
  );
//****************Patient Reviews**********************//  
let PatientsReviews={
  Reviews:[
    {"patient_name":"أحمد سعد" , "review":"الدكتور كان لطيف و العيادة كانت نضيفة", "rating":5 , id:1 },
    {"patient_name":"اسامة شريف" , "review":"خلصت الكشف بسرعة و الدكتور كان محترم", "rating":5 , id:2 },
    {"patient_name":"عبدو حبيب" , "review":"الدكتور ده كغأة", "rating":4 , id:3 },
    {"patient_name":"زياد نصرت" , "review":"تعامل الدكتور كان دون المستوى مش هروحله تاني", "rating":1 , id:4 },
    {"patient_name":"محمد ايمن" , "review":"سعيد جدا بتعاملي مع الدكتور ده و هرشحه لأصدقائي", "rating":5 , id:5 },
    {"patient_name":"اميرة بحجابي" , "review":"استنيت كتير اوي عشان ادخل للدكتور", "rating":2 , id:6 },
    {"patient_name":"ياسين" , "review":"ارجو مراعاة نظافة العيادة اكتر من كده", "rating":2 , id:7 },
  ]
};
  

const [fieldsEditable,setFieldsEditable] = useState(false);

  //  For SPECIALIZATION Dropdown
const [specializationOpen, setSpecializationOpen] = useState(false);
const [specializationItems, setSpecializationItems] = useState([
    { label: "Allergy and immunology", value: "Allergy and immunology" },
    { label: "Anesthesiology", value: "Anesthesiology" },
    { label: "Dermatology", value: "Dermatology" },
    { label: "Diagnostic radiology", value: "Diagnostic radiology" },
    { label: "Emergency medicine", value: "Emergency medicine" },
    { label: "Family medicine", value: "Family medicine" },
    { label: "Internal medicine", value: "Internal medicine" },
    { label: "Medical genetics", value: "Medical genetics" },
    { label: "Neurology", value: "Neurology" },
    { label: "Nuclear medicine", value: "Nuclear medicine" },
    { label: "Obstetrics and gynecology", value: "Obstetrics and gynecology" },
    { label: "Ophthalmology", value: "Ophthalmology" },
    { label: "Pathology", value: "Pathology" },
    { label: "Pediatrics", value: "Pediatrics" },
    {
      label: "Physical medicine and rehabilitation",
      value: "Physical medicine and rehabilitation",
    },
    { label: "Preventive medicine", value: "Preventive medicine" },
    { label: "Psychiatry", value: "Psychiatry" },
    { label: "Radiation oncology", value: "Radiation oncology" },
    { label: "Surgery", value: "Surgery" },
    { label: "Urology", value: "Urology" },
  ]);

  //  For HOSPITAL Dropdown
const [hospitalOpen, setHospitalOpen] = useState(false);
const [hospitalItems, setHospitalItems] = useState([
    { label: "Agial Hospital", value: "Agial Hospital", id: 1 },
    {
      label: "Alexandria University Main Hospital",
      value: "Alexandria University Main Hospital",
      id: 2,
    },
    { label: "Alex Radiology Center", value: "Alex Radiology Center", id: 3 },
    { label: "Al Andalusia Hospital", value: "Al Andalusia Hospital", id: 16 },
    {
      label: "Alexandria Pediatric Center",
      value: "Alexandria Pediatric Center",
      id: 4,
    },
    {
      label: "Alexandria Medical Center",
      value: "Alexandria Medical Center",
      id: 5,
    },
    { label: "Badrawy Hospital", value: "Badrawy Hospital", id: 6 },
    { label: "Coptic Hospital", value: "Coptic Hospital", id: 7 },
    { label: "Dar Al Shifa Hospital", value: "Dar Al Shifa Hospital", id: 8 },
    {
      label: "El Madina El Tebaya Hospital",
      value: "El Madina El Tebaya Hospital",
      id: 9,
    },
    { label: "El Shorouk Hospital", value: "El Shorouk Hospital", id: 10 },
    { label: "German Hospital", value: "German Hospital", id: 11 },
    {
      label: "Gamal Abd El Naser Hospital",
      value: "Gamal Abd El Naser Hospital",
      id: 12,
    },
    {
      label: "Mabaret Al-Asafra Hospitals",
      value: "Mabaret Al-Asafra Hospitals",
      id: 13,
    },
    { label: "Victoria Hospital", value: "Victoria Hospital", id: 14 },
    {
      label: "Alex Specialized Hospital",
      value: "Alex Specialized Hospital",
      id: 15,
    },
    { label: "Hassab Hospital", value: "Hassab Hospital", id: 16 },
    
  ]);
  
//  For SUPPORTED INSURANCES Dropdown
const [supportedInsurances, setSupportedInsurances] = useState(['Axa','Bupa']);
const [supportedInsurancesOpen, setSupportedInsurancesOpen] = useState(false);
const [supportedInsurancesItems, setSupportedInsurancesItems] = useState([
  {  id: 1 , label: "Axa" , value: "Axa"  },
  {  id: 2 , label: "Misr Insurance" ,  value: "Misr Insurance"},
  {  id: 3 , label: "Alianz", value: "Alianz"},
  {  id: 4 , label: "Bupa", value: "Bupa"},
  {  id: 5 , label: "Lintile" , value: "Lintile"},
  {  id: 6 , label: "Werty", value: "Werty"},
]);
  

///////////////////////   INPUT HANDLERS      ////////////////////////////////

const handleFirstNameChange = (val) => {
  setData({
    ...data,
    first_name: val,
  });
};

const handleLastNameChange = (val) => {
  setData({
    ...data,
    last_name: val,
  });
};

const handlePhoneNumberChange = (val) => {
  setData({
    ...data,
    phone_number: val,
  });
};

const handleDateofBirthChange = (val) => {
  setData({
    ...data,
    date_of_birth: val,
  });
};

const handleCityChange = (val) => {
  setData({
    ...data,
    city: val,
  });
};

const handleSpecializationChange = (val) => {
  setData({
    ...data,
    specialization: val.value,
  });
};

const handleConsultaionFeeChange = (val) => {
  setData({
    ...data,
    consultaion_fee: parseInt(val),
  });
};

const handleRegionChange = (val) => {
  setData({
    ...data,
    region: val,
  });
};

const handleHospitalChange = (val) => {
  setData({
    ...data,
    hospital_id: val.id,
    hospital:val.value,
  });
};


const handleQualificationsInstituteNameChange = (val) => {
  setData({
    ...data,
    //  institute_name : val,
    institute_name: val,
  });
};

const handleQualificationsQualificationNameChange = (val) => {
  setData({
    ...data,
    qualification_name: val,
  });
};

const handleQualificationsProcurementYearChange = (val) => {
  setData({
    ...data,
    procurement_year: val,
  });
};

//////////////////////////////////////////////////////////////////////////////


/********************************   SCREEN  **********************************************************/   

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/******************* ------------HEADER Section------------ *******************/}
      <View style={styles.headerView}>
        <View style={{ flexDirection: "column", marginTop: 25,alignItems:"center" }}>
          <Avatar.Image
            style={{ marginLeft: 15, marginTop: 5 }}
            source={require("../../assets/osama.jpg")}
            size={175}
          />

          <View style={styles.doctorDescription}>
            <Title style={styles.title}>{data.doctor_name}</Title>
            <StarRating
              starStyle={styles.stars}
              starSize={20}
              disabled={true}
              emptyStar={"ios-star-outline"}
              fullStar={"ios-star"}
              halfStar={"ios-star-half"}
              iconSet={"Ionicons"}
              maxStars={5}
              rating={data.rating}
              fullStarColor={"gold"}
            />
            <Caption style={styles.caption}>
              Overall Rating From {data.no_of_ratings} Visitors
            </Caption>
            <Caption
              style={[styles.caption, {fontWeight:"bold",fontSize:16, marginTop: 15, color: "black" }]}
            >
              {data.doctor_speciality}
            </Caption>
          </View>
        </View>
      </View>
      {/**************************--------------------------****************************/}
      <View style={styles.headerView}>
        <View style={styles.footer}>  
          {/******************     USERNAME     ************************************/}
          <Text style={styles.text_footer}>Username *</Text>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color="#05375a" size={20} /> */}
              <TextInput
               editable={false}
                placeholder="Your Username"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.username}
              />
            </View>  
          {/******************     EMAIL     ************************************/}
          <Text style={styles.text_footer}>Email *</Text>
            <View style={styles.action}>
              {/* <FontAwesome name="user-o" color="#05375a" size={20} /> */}
              <TextInput
               editable={false}
                placeholder="Your Username"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.email}
              />
            </View>
        </View>
      </View>



      {/******************* ------------DESCRIPTION Section------------ *******************/}
      <View style={styles.headerView}>
        <View style={styles.footer}>  
          {/********************** EDIT FIELDS BUTTON ****************************/}
            { !fieldsEditable?(
            <Pressable style={styles.button}  disabled={fieldsEditable} onPress={()=>setFieldsEditable(!fieldsEditable) }>
            <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={styles.editField}
              >
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "#fff",
                    },
                  ]}
                >
                   Edit Info
                </Text>
              </LinearGradient>
            </Pressable>)
            : 
            //////////   **********   DO NOT DELETE THIS SECTION   ********    /////////
            (
              <Pressable style={styles.button} disabled={!fieldsEditable} >
              <LinearGradient
                  colors={["white", "gray"]}
                  style={styles.editField}
                >
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: "#fff",
                      },
                    ]}
                  >
                     Edit Info
                  </Text>
                </LinearGradient>
              </Pressable>)
            }          



          {/******************     FIRST NAME     ************************************/}
          <Text style={styles.text_footer}>First Name</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
               editable={fieldsEditable}
                placeholder="Your Username"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.first_name}
                onChangeText={(val) => handleFirstNameChange(val)}
              />
            </View>
          {/******************     LAST NAME     ************************************/}
          <Text style={styles.text_footer}>Last Name</Text>
            <View style={styles.action}>
              <FontAwesome name="user-o" color="#05375a" size={20} />
              <TextInput
               editable={fieldsEditable}
                placeholder="Your Username"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.last_name}
                onChangeText={(val) => handleLastNameChange(val)}
              />
            </View>            
          {/******************     DATE OF BIRTH     ************************************/}
          <Text style={styles.text_footer}>Date of Birth</Text>
            <View style={styles.action}>
              <DatePicker
                style={styles.datePickerStyle}
                mode="date" // The enum of date, datetime and time
                placeholder="select date"
                date={data.date_of_birth}
                format="DD-MM-YYYY"
                minDate="01-01-1910"
                maxDate="01-01-2022"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                disabled={!fieldsEditable}
                customStyles={{
                  dateIcon: {
                    //display: 'none',
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                }}
                onDateChange={(val) => {
                  handleDateofBirthChange(val);
                }}
              />
            </View>  

          {/******************************      PHONE NUMBER     ***********************************/}
          <Text style={[styles.text_footer]}>
            Phone Number
          </Text>
          <View style={styles.action}>
            <FontAwesome name="phone" color="#05375a" size={20} />
            <TextInput
              placeholder="+20****"
              placeholderTextColor="#666666"
              value={data.phone_number}
              editable={fieldsEditable}
              keyboardType="numeric"
              style={[styles.textInput_2]}
              autoCapitalize="none"
              onChangeText={(val) => handlePhoneNumberChange(val)}
            />
          </View>
          {/******************************      CONSULTAION FEE     ***********************************/}
          <Text style={[styles.text_footer]}>
            Consultaion Fee
          </Text>
          <View style={styles.action}>
            <FontAwesome name="money" color="#05375a" size={20} />
            <TextInput
              placeholder="Enter fee amount"
              placeholderTextColor="#666666"
              keyboardType="numeric"
              style={[styles.textInput_2]}
              autoCapitalize="none"
              value={data.consultaion_fee}
              editable={fieldsEditable}
              onChangeText={(val) => handleConsultaionFeeChange(val)}
            />
          </View>


          {/******************************      CITY     ***********************************/}
          <Text style={[styles.text_footer]}>City</Text>
          <View style={styles.action}>
            <MaterialCommunityIcons name="city" color="#05375a" size={23} />
            <TextInput
              placeholder="Your City"
              placeholderTextColor="#666666"
              style={[styles.textInput_2]}
              autoCapitalize="none"
              value={data.city}
              editable={fieldsEditable}
              onChangeText={(val) => handleCityChange(val)}
            />
          </View>

          {/******************************      REGION     ***********************************/}
          <Text style={[styles.text_footer]}>Region</Text>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="home-city"
              color="#05375a"
              size={21}
            />
            <TextInput
              placeholder="Your City"
              placeholderTextColor="#666666"
              style={[styles.textInput_2]}
              autoCapitalize="none"
              autoCorrect={false}
              value={data.region}
              editable={fieldsEditable}
              onChangeText={(val) => handleRegionChange(val)}
            />
          </View>

          {/******************************      SPECIALIZATION     ***********************************/}
          <Text style={[styles.text_footer]}>
            Specialization
          </Text>
          <View style={{ marginTop: 10 }}>
            <DropDownPicker
              listMode="MODAL"
              open={specializationOpen}
              value={data.specialization}
              items={specializationItems}
              setOpen={setSpecializationOpen}
              disabled={!fieldsEditable}
              onSelectItem={(val) => {
                handleSpecializationChange(val);
              }}
            />
          </View>
          {/******************************      HOSPITAL     ***********************************/}
          <Text style={[styles.text_footer,{marginTop:10}]}>Hospital</Text>
          <View style={{ marginTop: 10 }}>
            <DropDownPicker
              listMode="MODAL"
              open={hospitalOpen}
              value={data.hospital}
              items={hospitalItems}
              setOpen={setHospitalOpen}
              disabled={!fieldsEditable}
              onSelectItem={(val) => {
                handleHospitalChange(val);
              }}
            />
          </View>
          {/******************************      SUPPORTED INSURANCES     ***********************************/}
          <Text style={[styles.text_footer,{marginTop:10}]}>Supported Insurances</Text>
          <View style={{ marginTop: 10 }}>
            <DropDownPicker
              multiple={true}
              min={0}
              // max={3}
              listMode="MODAL"
              mode="BADGE"
              open={supportedInsurancesOpen}
              value={supportedInsurances}
              setValue={setSupportedInsurances}
              items={supportedInsurancesItems}
              setItems={setSupportedInsurancesItems}
              setOpen={setSupportedInsurancesOpen}
              disabled={!fieldsEditable}
            />
          </View>

          {/******************************     QUALIFICATIONS SECTION     ***********************************/}
          <View>
            <Text style={styles.qualificationsStyle}>Qualifications Info</Text>

            <Text style={[styles.text_footer, { marginTop: 20 }]}>
              Qualification Name
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Qualification Name"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.qualification_name}
                editable={fieldsEditable}
                onChangeText={(val) =>
                  handleQualificationsQualificationNameChange(val)
                }
              />
            </View>

            <Text style={[styles.text_footer]}>
              Institute Name
            </Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Institute Name"
                placeholderTextColor="#666666"
                style={[styles.textInput_2]}
                autoCapitalize="none"
                value={data.institute_name}
                editable={fieldsEditable}
                onChangeText={(val) =>
                  handleQualificationsInstituteNameChange(val)
                }
              />
            </View>

            <Text style={[styles.text_footer]}>
              Procurement Year
            </Text>
            <View style={styles.action}>
              <DatePicker
                style={styles.datePickerStyle}
                mode="date" // The enum of date, datetime and time
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="01-01-1910"
                maxDate="01-01-2022"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                date={data.procurement_year}
                disabled={!fieldsEditable}
                customStyles={{
                  dateIcon: {
                    //display: 'none',
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                }}
                onDateChange={(val) => {
                  handleQualificationsProcurementYearChange(val);
                }}
              />
            </View>
          </View>





        {/********************** SUBMIT BUTTON ****************************/}
           { fieldsEditable?(
            <Pressable style={styles.button} disabled={!fieldsEditable} 
            onPress={()=>
            {
              // API CALL FOR SUBMIT THE EDIT 
              submitEditHandle(/*pass new data*/)
              setFieldsEditable(!fieldsEditable),
              alert("Changes Saved!") 
            }}
              >
            <LinearGradient
                colors={["#08d4c4", "#01ab9d"]}
                style={styles.submit}
              >
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: "#fff",
                    },
                  ]}
                >
                  Save
                </Text>
              </LinearGradient>
            </Pressable>): null}
        </View>
      </View>
      {/**************************--------------------------****************************/}


      {/******************* ------------PATIENT REVIEWS Section------------ *******************/}
      <View style={styles.bodyView}>
        <View>
          {/**********  Patient Reviews List   *******/}
          <ScrollView>
            <ReviewsList result={PatientsReviews.Reviews}/>
          </ScrollView>          
      {/**************************************************************************************/}
        </View>

 
{/****************   CLINIC & DOCTOR TREATMENT RATINGS ************************/}
<View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            marginBottom: 15,
          }}
        >
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.doctor_treatment_rating} /5
              </Text>
              <Text>Doctor Treatment</Text>
            </View>
          </View>
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.clinic_rating} /5
              </Text>
              <Text>Clinic</Text>
            </View>
          </View>
        </View>
        {/********************************************************/}
        {/* <View style={styles.lineStyle} /> */}
        {/****************   STAFF & WAITING TIME RATINGS ************************/}
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            marginBottom: 15,
          }}
        >
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.staff_rating} /5
              </Text>
              <Text>Staff</Text>
            </View>
          </View>
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.waiting_time_rating} /5
              </Text>
              <Text>Waiting Time </Text>
            </View>
          </View>
        </View>
        {/********************************************************/}
        {/* <View style={styles.lineStyle} /> */}
                {/****************   EQUIPMENT & PRICE RATINGS ************************/}
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            marginBottom: 15,
          }}
        >
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.equipement_rating} /5
              </Text>
              <Text>Equipment </Text>
            </View>
          </View>
          <View style={styles.smallSections}>
            <Ionicons
              name="star"
              color="#009387"
              size={25}
              style={[styles.icon, { color: "gold", alignSelf: "center" }]}
            />
            <View style={{ alignSelf: "center" }}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {data.price_rating} /5
              </Text>
              <Text>Price </Text>
            </View>
          </View>
        </View>
        {/********************************************************/}
        </View>
      {/******************------------------------------------------------*********************/}


    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  tagContainer: {
    borderColor: "#98fb98",
    borderWidth: 3,
    backgroundColor: "white",
  },
  stars: {
    alignSelf: "center",
  },
  headerView: {
    backgroundColor: "white",
    marginBottom: 15,
    // height: 160,
    // alignItems:"center",
  },
  bodyView: {
    backgroundColor: "white",
    marginBottom: 15,
    height: "auto",
  },
  aboutView: {
    backgroundColor: "white",
    marginBottom: 15,
    height: "auto",
  },
  smallSections: {
    flexDirection: "row",
    marginTop: 10,
    width: "50%",
  },
  smallSectionsReviews: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 2,
    width: "45%",
    // paddingHorizontal:5
  },
  smallSectionsTitle: {
    fontWeight: "bold",
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
  },
  sectionContent: {
    fontWeight: "normal",
    fontSize: 15,
    marginHorizontal: 20,
  },
  icon: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  doctorDescription: {
    marginLeft: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 1,
    alignItems:"center",
  },
  doctorName: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: 150,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 28,
    marginTop: 3,
    marginBottom: 10,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 13,
    lineHeight: 20,
    color: "#009387",
    flexShrink: 1,
    textAlign:"center",
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lineStyle: {
    borderWidth: 0.9,
    borderColor: "#e6e6fa",
    marginHorizontal: 20,
    marginVertical: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    alignSelf:"center",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width:150,
    height:40,
    marginBottom:20,
    
  },
  exitButton:{
    alignSelf:"flex-end",
    borderRadius: 20,
    // padding: 10,
    elevation: 2,
    width:50,
    height:50,
    // marginBottom:20,
    // backgroundColor:'black'
  },
  buttonOpen: {
    backgroundColor: "#90ee90",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize:20
  },
  buttonText:{
    alignSelf:"center",
    fontSize:18,
    fontWeight:"bold"

  },
  textInput: {
    // flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    width:300,
    textAlignVertical:"top",
   
    backgroundColor: "#f0f8ff",
    marginBottom:20,
  },
  hospitalName:{
    fontWeight:"bold",
    fontSize:20,
    textAlignVertical:"center",
  },
  footer: {
    flex: 5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#f2f2f2",
    paddingBottom: 25,
  },
  textInput_2: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
    backgroundColor: "white",
    // fontSize:18,
    height:40,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  editField: {
    // width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  submit: {
    // width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  button:{
    alignSelf:"center",
    width:150,
    marginVertical:15,
  },
  datePickerStyle: {
    width: "100%",
    // marginTop: 20,
    borderWidth: 0,
  },
  qualificationsStyle: {
    color: "#05375a",
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 30,
    paddingLeft: 40,
  },

});

export default DoctorProfileScreen;
