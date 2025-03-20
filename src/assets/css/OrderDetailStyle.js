import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    driverInfoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    licensePlate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50'
    },
    car_name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50'
    },
    driverDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    driverImage: {
        width: 45,
        height: 45,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#e8e8e8'
    },
    driverInfo: {
        marginLeft: 12,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50'
    },
    driverRating: {
        color: '#7f8c8d',
        fontSize: 14
    },
    orderItemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderItemDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderItemImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 10,
    },
    orderItemText: {
        flex: 1,
    },
    orderItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 4
    },
    orderItemOption: {
        color: '#7f8c8d',
        fontSize: 14,
        marginTop: 2
    },
    orderItemQuantity: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666'
    },
    orderInfPayText: {
        marginTop: 10,
        fontWeight: '600',
        fontSize: 16,
        color: '#FF0000'
    },
    noteContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 12,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    paymentMethodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    paymentInfoContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        color: '#2c3e50'
    },
    orderIdContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    orderId: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50'
    },
    orderTime: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8
    },
    paymentSumContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#e8e8e8',
        marginTop: 12,
        paddingTop: 12
    },
    completeButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    completeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    paymentText: {
        fontSize: 15,
        color: '#2c3e50'
    },
    paymentMethod: {
        fontSize: 15,
        color: '#2c3e50',
        fontWeight: '600'
    }
});
export default styles;