import { Text } from "@ui-kitten/components";
import React from "react";
import { ScrollView, View } from "react-native";
import FormButtons from "../../components/Buttons/FormButtons";
import { Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const Request = () => {
    const navigation = useNavigation()
  return (
    <View style={{ height: "100%", width: "100%" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Requests here</Text>
        </View>
      </ScrollView>
      <Surface
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
        elevation={1}
      >
        <FormButtons
          buttonColor={"#009688"}
          text={"ADD REQUEST"}
          textColor={"#fff"}
          onPress={() => navigation.navigate('AddRequests')}
          my={4}
        />
        {/* <FormButtons
          buttonColor={"#fff"}
          text={`CANCEL`}
          textColor={"#009688"}
          my={4}
          borderColor={"#009688"}
          onPress={() => {
            navigation.goBack();
          }}
        /> */}
      </Surface>
    </View>
  );
};

export default Request;
