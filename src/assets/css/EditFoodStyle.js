import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 5,
    },
    mainContainer: {
        backgroundColor: '#FFF'
    },
    infContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        padding: 10,
        margin: 10
    },
    foodImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        resizeMode: 'cover'
    },
    textLeft: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    textRight: {
        fontSize: 16,
        textAlign: 'right',
        color: '#333',
    },
    smallInput: {
        borderColor: '#F0F0F0',
        padding: 8,
        borderRadius: 5
    },
    descriptionInput: {
        width: '70%',
        minHeight: 80,
        textAlignVertical: 'top',
        padding: 8
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginVertical: 2
    },
    categoryText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '300'
    },
    toppingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    toppingName: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flex: 1,
        marginRight: 10,
        fontSize: 16,
        padding: 5,
        color: '#333'
    },
    toppingPrice: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        width: 80,
        textAlign: 'right',
        marginRight: 5,
        fontSize: 16,
        padding: 5,
        color: '#333'
    },
    addButton: {
        alignItems: 'center',
        marginVertical: 15,
        padding: 10
    },
    addButtonText: {
        fontSize: 16,
        color: '#f00',
        fontWeight: '500'
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    buttonContainer: {
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0'
    },
    editButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F00',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#32CD32',
        paddingVertical: 12,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    cancelButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F00',
        paddingVertical: 12,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutIcon: {
        marginLeft: 10,
    },
});
export default styles;