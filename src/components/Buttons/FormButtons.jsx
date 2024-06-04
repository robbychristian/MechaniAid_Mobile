import { TouchableOpacity } from "react-native";
import { Text } from "@ui-kitten/components";
const FormButtons = ({
  textColor,
  text,
  buttonColor,
  my,
  borderColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: buttonColor,
        paddingVertical: 10,
        width: "85%",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: my,
        borderWidth: borderColor ? 1 : 0,
        borderColor: borderColor,
      }}
    >
      <Text category="h6" style={{ color: textColor }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default FormButtons;
