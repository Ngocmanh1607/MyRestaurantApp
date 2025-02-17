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
    },
    descriptionInput: {
        width: '70%',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    toppingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 10
    },
    toppingName: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        flex: 1,
        marginRight: 10,
        fontSize: 16,

    },
    toppingPrice: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        width: 80,
        textAlign: 'right',
        marginRight: 5,
        fontSize: 16,
    },
    addButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        fontSize: 16,
        color: '#f00'
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
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
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#32CD32',
        paddingVertical: 12,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F00',
        paddingVertical: 12,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
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