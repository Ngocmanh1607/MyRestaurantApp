import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  // Status styles
  statusContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Order Info Section
  orderInfo: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  orderUser: {
    marginBottom: 8,
  },
  customerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  icon: {
    marginHorizontal: 8,
  },
  // Section title
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  // Driver styles
  driverInfoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  car_name: {
    fontSize: 14,
    color: '#424242',
    marginLeft: 8,
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverInfo: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 14,
    color: '#424242',
    marginBottom: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  callButtonText: {
    color: 'white',
    marginLeft: 6,
    fontWeight: '500',
  },
  // Order items styles
  orderedItemsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderItemContainer: {
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderItemContainer: {
    marginVertical: 8,
  },
  orderItemDetails: {
    flexDirection: 'row',
  },
  orderItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  orderItemText: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderItemOption: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
    marginBottom: 2,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#424242',
  },
  orderInfPayText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  // Note styles
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  noteText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#424242',
  },
  // Payment styles
  paymentInfoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentDetailLabel: {
    fontSize: 14,
    color: '#424242',
  },
  paymentDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentSumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 4,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  lastItemNoBorder: {
    borderBottomWidth: 0,
  },
});

export default styles;
