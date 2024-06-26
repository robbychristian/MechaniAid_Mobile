import React, { useEffect } from 'react'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { Card, Text } from '@ui-kitten/components'
import ChatCard from '../../components/Cards/ChatCard';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading';
import { getChatList } from '../../store/chat/Chat';

const ChatList = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const {loading, chatList} = useSelector((state) => state.chat)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                await dispatch(getChatList(user.id))
            } catch (err) {
                console.log(err)
            }
        })
        return unsubscribe
    }, [navigation])

    return (
        <View style={{ width: '100%' }}>
            <Loading loading={loading} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {chatList.length > 0 ? chatList.map((item, index) => {
                    return (
                        <ChatCard key={index} item={item} onPress={() => navigation.navigate("Chat", {
                            mechanics_id: user.user_role == 3 ? item.user_2 : item.user_1,
                            chat_id: item.id
                        })} />
                    )
                }) : (
                    <Card style={{ height: "100%", alignItems: 'center' }}>
                        <Text category='h6'>Nothing to display yet!</Text>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}

export default ChatList;