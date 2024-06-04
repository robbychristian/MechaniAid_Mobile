import { Card, Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";

const RequestCard = ({ id, name, }) => {
  return (
    <Card disabled>
      <Text category="h5" style={{ color: "#0284C7" }}>
        Document Type: {docType}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">ID: {id}</Text>
        <Text category="label">Name: {name}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text category="label">Email: {email}</Text>
      </View>
    </Card>
  );
};

export default RequestCard;
