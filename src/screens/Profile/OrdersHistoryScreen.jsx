import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOrders } from '../../api/restaurantApi';
import { FlatList } from 'react-native-gesture-handler';
import CardOrderInHistory from '../../components/CardOrderInHistory';
const OrdersHistoryScreen = () => {
    const [orders, setOrders] = useState();
    useEffect(() => {
        const getOrder = async () => {
            try {
                const response = await getOrders();
                setOrders(response);
                console.log(response);
            } catch (error) {

            }
        }
        getOrder();
    }, []);
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatList}
                data={orders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <CardOrderInHistory item={item} />
                )}
            />
        </View>
    )
}

export default OrdersHistoryScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatList: {
        marginHorizontal: 10,
    },
})