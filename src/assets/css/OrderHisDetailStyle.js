import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  // Order ID and Status Section
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeaderLeft: {
    flexDirection: 'column',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },

  // Customer Information
  customerInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  customerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  customerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Address Information
  addressContainer: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 8,
    padding: 16,
  },
  addressDetails: {
    marginTop: 8,
    paddingLeft: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  addressNote: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Driver Information
  driverInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  vehicleInfo: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  licensePlate: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Order Items Section
  itemsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderItemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderItemDetails: {
    flexDirection: 'row',
  },
  orderItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  orderItemText: {
    flex: 1,
    justifyContent: 'space-between',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderItemOption: {
    fontSize: 13,
    color: '#666',
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
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666',
  },
  orderItemTotal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e53935',
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  // Note Section
  noteContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  // Payment Information
  paymentInfoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  couponLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  couponBadge: {
    backgroundColor: '#f8e5e5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#e53935',
    borderStyle: 'dashed',
  },
  couponCode: {
    fontSize: 12,
    color: '#e53935',
    fontWeight: 'bold',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
  },
  paymentSumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  totalDiscountRow: {
    backgroundColor: '#f0fff0',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#daf0da',
    marginTop: 8,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e53935',
  },
  paymentMethodContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paymentMethodLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentMethodValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
});

export default styles;
