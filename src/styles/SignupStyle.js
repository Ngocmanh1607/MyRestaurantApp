import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    inputSignContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 10,
        marginHorizontal: 40,
        marginVertical: 10,
        elevation: 10,
        alignItems: 'center',
        height: 50,
    },
    inputIcon: {
        marginLeft: 15,
        marginRight: 5,
    },
    textInput: {
        flex: 1,
        color: "#222222"
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
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        marginStart: 50,
        color: 'red',
        fontSize: 14
    },
});
export default styles;