import { Text } from "@ui-kitten/components";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ChatCard = ({item, onPress}) => {
  const {user} = useSelector(state => state.auth)
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingVertical: 10,
        // borderBottomWidth: .5,
        borderWidth: 1,
        borderColor: "#E4E9F2",
        borderRadius: 15,
        marginBottom: 10,

      }}
      onPress={onPress}
    >
      <Image
        source={{
          uri: `https://mechaniaid.com/api/seller-image/${user.id == item.user_2 ? item.user1.customers.customers_profile_pic : item.user2.mechanics.mechanics_profile_pic}`,
        }}
        style={{ height: 60, width: 60, borderRadius: 50 }}
      />
      <View style={{justifyContent: "center", alignItems: "center", marginLeft: 10 }}>
        <Text style={{ fontFamily: "Nunito-Bold", fontSize: 18 }}>{user.id == item.user_2 ? `${item.user1.first_name} ${item.user1.last_name}` : `${item.user2.first_name} ${item.user2.last_name}`}</Text>
        {/* <Text category="h6">{item.user_1}</Text> */}
        {/* <Text category="c1">{item.messages[0].message}</Text> */}
      </View>
      <MaterialCommunityIcons name="chat-outline" size={30} color="black" style={{position: "absolute", right: 10, top: 25}} />
    </TouchableOpacity>
  );
};

export default ChatCard;
