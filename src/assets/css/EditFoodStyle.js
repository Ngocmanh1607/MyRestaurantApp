import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  editHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editHeaderText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  imageContainerEditing: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textAreaInput: {
    height: 100,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 15,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
    borderColor: '#E0E0E0',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#333333',
  },
  addToppingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addToppingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  toppingsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  toppingHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  toppingHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  toppingRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  toppingName: {
    flex: 3,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333333',
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  toppingPrice: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333333',
    textAlign: 'right',
  },
  emptyToppings: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
  },
  emptyToppingsText: {
    color: '#999999',
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  saveButton: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: '#32cd32',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
});
export default styles;
