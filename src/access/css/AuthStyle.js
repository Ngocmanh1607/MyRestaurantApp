import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    indicator: {
        backgroundColor: "#FF0000",
        width: '30%',
        marginHorizontal: '10%'
    },
    tabBar: {
        backgroundColor: "#FFFFFF",
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',

    },
    container: {
        flex: 1,
        zIndex: 0,
    },
    topImageContainer: {
        height: "35%",
        flexDirection: 'row',
        justifyContent: 'center',
    },
    topImage: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
    },
    animatedContainer: {
        flex: 1,
        left: 0,
        right: 0,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        zIndex: 1,
    },
});
export default styles;