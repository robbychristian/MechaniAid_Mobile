import { Button, Input } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomTextInput from "../../components/Inputs/CustomTextInput";
import CustomTextInputMultiline from "../../components/Inputs/CustomTextInputMultiline";
import { useNavigation } from "@react-navigation/native";
import CustomSimpleSelect from "../../components/Inputs/CustomSimpleSelect";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from "expo-document-picker";
import { useSelector } from "react-redux";
import { api } from "../../../config/api";
import { Toast } from "toastify-react-native";
import Loading from "../../components/Loading";


const AddProduct = () => {
    const navigation = useNavigation();
    const { user } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const [fileUploadError, setFileUploadError] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setFileUpload(null);
            setFileUploadError(false);
            reset();
        })
        return unsubscribe
    }, [navigation])

    const onSubmit = (data) => {
        if (!fileUpload) {
            setFileUploadError(true);
        } else {
            setFileUploadError(false);
            setIsLoading(true);

            const file = {
                uri: fileUpload.uri,
                type: "multipart/form-data",
                name: fileUpload.name,
            }


            // console.log(`product_name`, data.product_name);
            // console.log(`details`, data.details);
            // console.log(`condition`, data.condition);
            // console.log(`brand`, data.brand);
            // console.log(`availability`, data.availability);
            // console.log(`location`, data.location);
            // console.log(`price`, data.price);
            // console.log(`mechanics_id`, user.id);
            // console.log(`product_image`, file);


            const formdata = new FormData();
            formdata.append('product_name', data.product_name);
            formdata.append('details', data.details);
            formdata.append('condition', data.condition);
            formdata.append('brand', data.brand);
            formdata.append('availability', data.availability);
            formdata.append('location', data.location);
            formdata.append('price', data.price);
            formdata.append('mechanics_id', user.id);
            formdata.append('product_image', file);

            api.post('/store-product', formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((response) => {
                    console.log(response);
                    Toast.success("Product added successfully!");
                    reset();
                    navigation.navigate("Market")
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false);
                })

            // console.log([data])
        }
    }

    const uploadFile = async () => {
        const result = await DocumentPicker.getDocumentAsync({})
        setFileUpload(result.assets[0])
    }

    const conditionOptions = [
        { title: "New", value: "New" },
        { title: "Used - Like New", value: "Used - Like New" },
        { title: "Used - Good", value: "Used - Good" },
        { title: "Used - Fair", value: "Used - Fair" },
    ];

    const brandOptions = [
        { title: "Nissan", value: "Nissan" },
        { title: "Hyundai", value: "Hyundai" },
        { title: "Suzuki", value: "Suzuki" },
        { title: "Ford", value: "Ford" },
        { title: "Honda", value: "Honda" },
        { title: "Isuzu", value: "Isuzu" },
        { title: "Kia", value: "Kia" },
        { title: "Mazda", value: "Mazda" },
        { title: "Other", value: "Other" },
    ];

    const availabilityOptions = [
        { title: "In Stock", value: "In Stock" },
        { title: "Only One", value: "Only One" },
        { title: "Sold", value: "Sold" },
    ]

    return (
        <View style={{ padding: 20 }}>
            <Loading loading={isLoading} />
            <ScrollView>
                <Text style={styles.heading}>Add Product</Text>
                <CustomTextInput
                    control={control}
                    errors={errors}
                    label={`Product Name`}
                    name={"product_name"}
                    rules={{ required: true }}
                    message={`Product Name is required!`}
                    my={5}
                />

                <CustomTextInput
                    control={control}
                    errors={errors}
                    label={`Location`}
                    name={"location"}
                    rules={{ required: true }}
                    message={`Location is required!`}
                    my={5}
                />

                <CustomSimpleSelect
                    control={control}
                    errors={errors}
                    label={`Condition`}
                    message={`Please select a condition`}
                    my={5}
                    name={`condition`}
                    options={conditionOptions}
                    rules={{ required: true }}
                    isFull={true}
                />

                <CustomSimpleSelect
                    control={control}
                    errors={errors}
                    label={`Brand`}
                    message={`Please select a brand`}
                    my={5}
                    name={`brand`}
                    options={brandOptions}
                    rules={{ required: true }}
                    isFull={true}
                />

                {/* <CustomSimpleSelect
                    control={control}
                    errors={errors}
                    label={`Availability`}
                    message={`Please select a availability`}
                    my={5}
                    name={`availability`}
                    options={availabilityOptions}
                    rules={{ required: true }}
                    isFull={true}
                /> */}

                <Controller
                    control={control}
                    rules={{
                        required: "Availability is required!",
                        pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: "Availability must be a valid number",
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                        <Text style={styles.label}>Availability</Text>
                        <Input
                            onChangeText={onChange}
                            onBlur={() => {
                                onBlur();
                                setIsFocused(false);
                            }}
                            onFocus={() => setIsFocused(true)}
                            value={value}
                            style={[
                                styles.input,
                                { width: '100%' },
                                isFocused && styles.focusedInput
                            ]}
                        />
                        </>
                    )}
                    name={`availability`}
                />
                {errors['availability'] && (
                    <Text style={{ marginVertical: 5, fontSize: 12, fontWeight: '700', color: '#FF3D71' }}>
                        {errors['availability'].message}
                    </Text>
                )}

                <Controller
                    control={control}
                    rules={{
                        required: "Price is required!",
                        pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: "Price must be a valid number",
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <>
                        <Text style={styles.label}>Price</Text>
                        <Input
                            onChangeText={onChange}
                            onBlur={() => {
                                onBlur();
                                setIsFocused(false);
                            }}
                            onFocus={() => setIsFocused(true)}
                            value={value}
                            style={[
                                styles.input,
                                { width: '100%' },
                                isFocused && styles.focusedInput
                            ]}
                        />
                        </>
                    )}
                    name={`price`}
                />
                {errors['price'] && (
                    <Text style={{ marginVertical: 5, fontSize: 12, fontWeight: '700', color: '#FF3D71' }}>
                        {errors['price'].message}
                    </Text>
                )}

                <CustomTextInputMultiline
                    control={control}
                    errors={errors}
                    label={`Details`}
                    name={"details"}
                    rules={{ required: true }}
                    message={`Details is required!`}
                    my={5}
                />

                <Button style={{ backgroundColor: "#EF4141", borderColor: "#EF4141", marginTop: 10 }} onPress={uploadFile}>Upload Image</Button>

                {fileUploadError && (
                    <Text style={{ marginVertical: 5, fontSize: 12, fontWeight: '700', color: '#FF3D71' }}>
                        Image is required!
                    </Text>
                )}
                {fileUpload && (
                    <Image
                        source={{ uri: fileUpload.uri }}
                        style={{ height: 100, width: 100, marginVertical: 10 }}
                    />
                )}

                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 20 }}>
                    <Button size="small" appearance="outline" status="basic" onPress={() => navigation.navigate("Market")}>Cancel</Button>
                    <Button size="small" style={{ backgroundColor: "#EF4141", borderColor: "#EF4141" }} onPress={handleSubmit(onSubmit)}>Submit</Button>
                </View>
            </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    label: {
        marginBottom: 5,
        fontSize: 15,
        fontFamily:"Nunito-Bold"
      },
    heading: {
        fontFamily: "Nunito-Bold",
        marginBottom: 10,
        fontSize: 20, // Adjust the size for emphasis
    },

    input: {
        height: 70,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        // borderRadius: 15,
    },
    focusedInput: {
        borderColor: 'red',
    },
})

export default AddProduct;