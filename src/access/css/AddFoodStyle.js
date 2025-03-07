import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    textArea: {
        backgroundColor: '#fff',
        height: 100,
        marginBottom: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    createCategoryButton: {
        backgroundColor: 'transparent',
        padding: 10,
        marginBottom: 20,
    },
    createCategoryButtonText: {
        color: '#007bff',
        fontSize: 16,
        textAlign: 'left',
    },
    pickerContainer: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#FF0000',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    optionName: {
        flex: 3,
        backgroundColor: '#fff',
        marginRight: 10,
    },
    optionPrice: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#007bff',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
    }
});
export default styles;