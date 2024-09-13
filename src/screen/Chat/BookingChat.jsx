import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, BackHandler } from "react-native";
import { Input, Text } from "@ui-kitten/components";
import { IconButton, Surface } from "react-native-paper";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import { api } from "../../../config/api";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getChat, sendMessage } from "../../store/chat/Chat";
import moment from "moment";

const BookingChat = ({ mechanics_id, chat_id }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { chatMessages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if(user.user_role == 3){
          navigation.navigate("Booking");
        } 
        
        // else {
        //   navigation.goBack();
        // }
        // navigation.goBack();
        return true; // Prevent default behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        // Cleanup the back handler
        backHandler.remove();
      };
    }, [navigation])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const inputs = {
          user_id: user.user_role == 3 ? user.id : mechanics_id,
          mechanics_id:
            user.user_role == 3 ? mechanics_id : user.id,
          chat_id: chat_id,
        };
        await dispatch(getChat(inputs));
      } catch (err) {
        console.log(err.response);
      }
    });
    const interval = setInterval(async () => {
      try {
        const inputs = {
          user_id: user.user_role == 3 ? user.id : mechanics_id,
          mechanics_id:
            user.user_role == 3 ? mechanics_id : user.id,
          chat_id: chat_id,
        };
        await dispatch(getChat(inputs));
      } catch (err) {
        console.log(err.response);
      }
    }, 3000);
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [navigation, mechanics_id, chat_id]);

  const onSubmit = async () => {
    try {
      const inputs = {
        user_id: user.user_role == 3 ? user.id : mechanics_id,
        mechanics_id: user.user_role == 3 ? mechanics_id : user.id,
        is_mechanic: user.user_role == 2 ? user.id : null,
        message: message,
      };
      const response = await dispatch(sendMessage(inputs));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ width: "100%", height: "100%" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {chatMessages != undefined &&
          chatMessages.messages != undefined &&
          chatMessages.messages.length > 0 ? (
          chatMessages.messages.map((item, index) => {
            if (item.sender_id == user.id) {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      maxWidth: 310,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#A02828",
                        backgroundColor: "#fff",
                        borderWidth: 0.5,
                        borderColor: "#A02828",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      {item.message}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#808080" }}>{moment(item.created_at).format("lll")}</Text>
                  </View>
                  <Image
                    source={{
                      uri: `https://mechaniaid.com/api/seller-image/1718212902_pic1.jpg`,
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      marginHorizontal: 10,
                      marginVertical: 5,
                      borderRadius: 50,
                    }}
                  />
                </View>
              );
            } else {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                    marginTop: 10,
                  }}
                >
                  <Image
                    source={{
                      uri: `https://mechaniaid.com/api/seller-image/1718212902_pic1.jpg`,
                    }}
                    style={{
                      height: 50,
                      width: 50,
                      marginHorizontal: 10,
                      marginVertical: 5,
                      borderRadius: 50,
                    }}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      maxWidth: 310,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        backgroundColor: "#A02828",
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                      }}
                    >
                      {item.message}
                    </Text>
                    <Text style={{ marginTop: 4, color: "#808080" }}>{moment(item.created_at).format("lll")}</Text>
                  </View>
                </View>
              );
            }
          })
        ) : null}
      </ScrollView>
      <Surface
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          flexDirection: "row",
        }}
        elevation={1}
      >
        <Input
          value={message}
          onChangeText={(value) => setMessage(value)}
          style={{ width: "90%" }}
          placeholder="Type your message..."
        />
        <IconButton
          onPress={onSubmit}
          icon={"send"}
          size={20}
          iconColor="#EF4141"
        />
      </Surface>
    </View>
  );
};

export default BookingChat;
