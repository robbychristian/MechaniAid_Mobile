import { Text } from "@ui-kitten/components";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const ChatCard = ({item, onPress}) => {
  const {user} = useSelector(state => state.auth)
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        paddingHorizontal: 5,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
      }}
      onPress={onPress}
    >
      <Image
        source={{
          // uri: `https://mechaniaid.com/api/seller-image/${user.id == item.user_2 ? item.user1.customers.customers_profile_pic : item.user2.mechanics.mechanics_profile_pic}`,
        }}
        style={{ height: 60, width: 60, borderRadius: 50 }}
      />
      <View style={{ justifyContent: "center", marginLeft: 10 }}>
        <Text category="h6">{user.id == item.user_2 ? `${item.user1.first_name} ${item.user1.last_name}` : `${item.user2.first_name} ${item.user2.last_name}`}</Text>
        {/* <Text category="h6">{item.user_1}</Text> */}
        <Text category="c1">{item.messages[0].message}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCard;
