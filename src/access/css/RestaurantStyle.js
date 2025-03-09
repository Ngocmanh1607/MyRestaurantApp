import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileSection: {
        marginBottom: 30,
    },
    workingHoursSection: {
        marginBottom: 30,
    },
    salesSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    profileInfo: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        fontSize: 16,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    workingHoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    workingHoursDay: {
        flex: 1,
        fontSize: 16,
    },
    workingHoursInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
        fontSize: 16,
        textAlign: 'center',
    },
    workingHoursText: {
        fontSize: 16,
    },
    imagePicker: {
        width: 120,
        height: 120,
        backgroundColor: '#ddd',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    imagePlaceholderText: {
        color: '#888',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    addressContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    buttonContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    editButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F00',
        paddingVertical: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
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
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#F00',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '45%',
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