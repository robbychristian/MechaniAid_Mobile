import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { useForm } from "react-hook-form";
import Loading from "../../components/Loading";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";

const AcceptBooking = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  useEffect(() => {
    console.log(route.params.item);
    setLoading(true);
    api
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${route.params.item.booking_details.latitude}&lon=${route.params.item.booking_details.longitude}&format=json&addressdetails=1`
      )
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setAddress(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    const unsubscribe = navigation.addListener("focus", () => {
      console.log(route.params.item);
    });
    return unsubscribe;
  }, [route.params.item, navigation]);

  const onSubmit = (data) => {
    setLoading(true)
    api.post('submitbooking',{
        booking_id: route.params.item.id,
        total_price: data.total_price,
        // service_type: data.service_type
    }).then((response) => {
        setLoading(false)
        Toast.success("Booking updated!")
        navigation.navigate('Market')
    }).catch(err => {
        console.log(err.response)
    })
  }

  return (
    <View style={{ width: "100%", paddingVertical: 10, paddingHorizontal: 15 }}>
      {address == null ? (
        <Loading loading={loading} />
      ) : (
        <>
          <View style={{ paddingBottom: 10 }}>
            <Text category="h5" style={{ color: "rgb(153 29 29)" }}>
              Booking Details
            </Text>
            <Text category="p1">
              <Text style={{ fontWeight: "700" }}>Name:</Text>{" "}
              {route.params.item.first_name} {route.params.item.last_name}
            </Text>
            <Text category="p1">
              <Text style={{ fontWeight: "700" }}>Location:</Text>{" "}
              {address.address.road}, {address.address.neighbourhood},{" "}
              {address.address.city}
            </Text>
          </View>
          {/* <View style={{ paddingVertical: 10 }}>
            <Text category="h5" style={{ color: "rgb(153 29 29)" }}>
              What type of service does the customer require?
            </Text>
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Service Type`}
              message={`Service Type is required`}
              name={`service_type`}
              rules={{ required: true }}
            />
          </View> */}
          <View style={{ paddingVertical: 10 }}>
            <Text category="h5" style={{ color: "rgb(153 29 29)" }}>
              How much would it cost?
            </Text>
            <CustomTextInput
              control={control}
              errors={errors}
              label={`Total Price`}
              message={`Total Price is required`}
              name={`total_price`}
              rules={{ required: true }}
            />
          </View>
          <View style={{ paddingVertical: 10 }}>
            <Button onPress={handleSubmit(onSubmit)} style={{ backgroundColor: "#A02828", borderColor: "#A02828" }}>COMPLETE BOOKING</Button>
          </View>
        </>
      )}
    </View>
  );
};

export default AcceptBooking;
