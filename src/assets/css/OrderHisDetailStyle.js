import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header Order Section
  orderIdContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderTime: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Driver Section
  driverInfoContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 8,
  },
  vehicleInfo: {
    marginBottom: 12,
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 8,
  },
  car_name: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
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
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },

  // Order Items Section
  orderItemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  orderItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  orderItemText: {
    flex: 1,
    marginLeft: 12,
  },
  orderItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderItemOption: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  orderInfPayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#f43f5e',
    marginTop: 4,
  },

  // Note Section
  noteContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
  },

  // Payment Section
  paymentInfoContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
  },
  paymentMethod: {
    fontSize: 15,
    color: '#4b5563',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f43f5e',
  },
  paymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentText: {
    fontSize: 15,
    color: '#4b5563',
  },
  paymentSumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f43f5e',
  },

  // Divider
  divider: {
    height: 8,
    backgroundColor: '#f3f4f6',
  },
});
