import io from 'socket.io-client';
// Connect to the WebSocket
const socket = io('https://vpvt75qh-3000.asse.devtunnels.ms');

socket.on('connect', () => {
  console.log('Connected to WebSocket!');
  socket.emit('joinRestaurant', restaurantId);
});

// Listen for orders list
socket.on('ordersList', (orders) => {
  setOrders(orders);
});

// Listen for new orders
socket.on('orderReceived', (data) => {
  console.log(data.message);
  setOrders(data.orders);
});

// Listen for order updates
socket.on('orderUpdated', (data) => {
  console.log(data.message);
  setOrders(data.orders);
});

// Listen for errors
socket.on('error', (error) => {
  setErrorMessage(error.message);
});
