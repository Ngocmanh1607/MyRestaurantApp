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
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    imagePlaceholderText: {
        color: '#888',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        justifyContent: 'space-between',
    },
    optionName: {
        flex: 3,
        backgroundColor: '#fff',
        marginRight: 10,
        borderRadius: 8,
    },
    optionPrice: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
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
        color: '#333',
    },
    checkbox: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
        marginRight: 10,
        color: '#333',
    }
});
export default styles;