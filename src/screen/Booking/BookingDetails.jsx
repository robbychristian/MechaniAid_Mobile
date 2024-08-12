import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { IconButton, Card } from "react-native-paper";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo vector icons

const BookingDetails = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const navigation = useNavigation();
  const route = useRoute();

  const onSubmit = (data) => {
    navigation.navigate("Booking", {
      service_type: data.service_type,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <IconButton
            icon={() => <Ionicons name="arrow-back" size={30} color="black" />}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.title}>Booking Details</Text>
        </View>
        <Text style={styles.subtitle}>What should we fix today?</Text>
        <Image
          source={require("../../../assets/repair.png")}
          style={styles.image}
        />

        <Card style={styles.card}>
         
        <CustomTextInput
              control={control}
              errors={errors}
              label={`Service Type`}
              message={`Service Type is required`}
              my={5}
              name={`service_type`}
              rules={{ required: true }}
            />
         
          <Text style={styles.hintText}>
            * Initial cost of booking a mechanic is P100 and may vary depending on the problem assessed by the mechanic.
          </Text>
        </Card>

        {/* <Button
          onPress={handleSubmit(onSubmit)}
          style={styles.completeButton}
        >
          COMPLETE BOOKING
        </Button> */}

        <Button
          appearance="filled"
          style={styles.buttonStyle}
          onPress={handleSubmit(onSubmit)}
        >
         {() => <Text style={styles.textStyle}>PROCEED</Text>}
        </Button>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  innerContainer: {
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: 30,
    marginLeft: 10,
  },
  subtitle: {
    fontFamily: "Nunito-Light",
    fontSize: 15,
    marginVertical: 5,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 25,
  },
  card: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 10,
  },
  hintText: {
    marginTop: 10,
    fontSize: 12,
    color: "#8f9bb3",
  },
  completeButton: {
    backgroundColor: "#A02828",
    borderColor: "#A02828",
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 10,
  },
  backButton: {
    padding: 0,
  },
  buttonStyle: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 50,
    borderColor: "#EF4141",
    backgroundColor: "#EF4141",
    borderRadius: 50,
    paddingVertical: 15,
  },
  textStyle: { 
    fontFamily: "Nunito-Bold",  
    fontSize: 20, 
    color: "#fff" 
  },
});

export default BookingDetails;
