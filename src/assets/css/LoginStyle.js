
import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: "#222",
    },
    forgotPassText: {
        color: "#F00",
        textAlign: 'right',
        width: '90%',
        fontSize: 15,
        marginVertical: 10,
    },
    loginButtonContainer: {
        width: '70%',
        height: 50,
        backgroundColor: "#FF0000",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 10,
        elevation: 5
    },
    textLogin: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    horizontalLine: {
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        width: '40%',
        alignSelf: 'center'
    },
    googleButtonContainer: {
        flexDirection: 'row',
        width: '70%',
        height: 50,
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 10,
        elevation: 5,
    },
    textLoginGoogle: {
        color: '#222',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 10,
        marginHorizontal: 40,
        marginVertical: 10,
        elevation: 10,
        alignItems: 'center',
        height: 50,
    },
    errorText: {
        marginStart: 50,
        color: 'red',
        fontSize: 14
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default styles;