import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";

const BookingHistory = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const route = useRoute();
  const navigation = useNavigation();

  const onSubmit = (data) => {
    navigation.navigate("Booking", {
      service_type: data.service_type
    })
  }

  return (
    <View style={{ width: "100%", paddingVertical: 10, paddingHorizontal: 15 }}>
      <View style={{ paddingBottom: 10 }}>
        <Text category="h5" style={{ color: "rgb(153 29 29)" }}>
          Booking History
        </Text>
        {/* <CustomTextInput
          control={control}
          errors={errors}
          label={`Service Type`}
          message={`Service Type is required`}
          name={`service_type`}
          rules={{ required: true }}
        />
        <Text category="c2" appearance="hint">
          * Initial cost of booking a mechanic is P100 and would vary depending
          on the problem issued by the mechanic
        </Text> */}
      </View>
      {/* <View style={{ paddingVertical: 10 }}>
        <Button onPress={handleSubmit(onSubmit)} style={{ backgroundColor: "#A02828", borderColor: "#A02828" }}>COMPLETE BOOKING</Button>
      </View> */}
    </View>
  );
};

export default BookingHistory;
