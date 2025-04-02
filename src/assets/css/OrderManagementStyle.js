import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    height: 55,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
    marginStart: 2,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    marginRight: 8,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  activeTab: {
    fontWeight: 'bold',
    color: '#FF0000',
    borderBottomWidth: 2,
    borderBottomColor: '#FF0000',
  },
  inactiveTab: {
    color: '#A0A0A0',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  orderInfo: {
    flex: 1,
  },
  orderInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderItems: { color: '#333' },
  orderAddress: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  orderBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmOrder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelOrder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    backgroundColor: '#FF3333',
    padding: 8,
    borderRadius: 10,
    marginBottom: 5,
  },
  textOrderPro: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#FF3333',
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  modalButtonSubmit: {
    flex: 1,
    backgroundColor: '#00CC66',
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  reasonOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  reasonText: {
    fontSize: 16,
    color: '#333',
  },
});
export default styles;
