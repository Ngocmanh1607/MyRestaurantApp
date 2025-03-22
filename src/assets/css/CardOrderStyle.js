import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    orderInfo: {
        flex: 1,
        marginRight: 10
    },
    orderInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    orderId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2c3e50'
    },
    orderTime: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 4
    },
    orderName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#34495e',
        marginBottom: 4
    },
    orderItems: {
        color: '#7f8c8d',
        fontSize: 14,
        marginBottom: 4
    },
    orderAddress: {
        fontSize: 14,
        color: '#95a5a6',
        marginBottom: 4
    },
    orderBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2ecc71',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        marginBottom: 10
    },
    cancelOrder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        marginBottom: 5,
        width: 95,
    },
    textOrderPro: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7f8c8d'
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#bdc3c7',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
        fontSize: 15
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButtonCancel: {
        flex: 1,
        backgroundColor: '#e74c3c',
        paddingVertical: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: 'center',
    },
    modalButtonSubmit: {
        flex: 1,
        backgroundColor: '#2ecc71',
        paddingVertical: 12,
        borderRadius: 8,
        marginLeft: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    reasonOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
        width: '100%'
    },
    reasonText: {
        fontSize: 15,
        color: '#34495e',
    },
    textStatus: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '500'
    }
});

export default styles;