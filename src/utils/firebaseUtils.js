
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const uploadRestaurantImage = async (userId, imageUri) => {
    try {
        const response = await fetch(imageUri); // Lấy ảnh từ URI
        const blob = await response.blob(); // Chuyển đổi thành blob

        // Tạo tham chiếu đến nơi lưu trữ ảnh
        const storageRef = ref(storage, `restaurants/${userId}/restaurant_image.jpg`);

        // Upload ảnh
        await uploadBytes(storageRef, blob);

        // Lấy URL của ảnh sau khi upload
        const downloadURL = await getDownloadURL(storageRef);

        console.log('Image URL:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const uploadFoodImage = async (restaurantId, foodName, imageUri) => {
    try {
        const response = await fetch(imageUri); // Lấy ảnh từ URI
        const blob = await response.blob(); // Chuyển đổi thành blob

        const storageRef = ref(storage, `restaurants/${restaurantId}/food-images/${foodName}.jpg`);
        // Upload ảnh
        await uploadBytes(storageRef, blob);

        // Lấy URL của ảnh sau khi upload
        const downloadURL = await getDownloadURL(storageRef);

        console.log('Image URL:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.log('Lỗi upload ảnh món ăn:', error);
        throw error;
    }
};


export { uploadRestaurantImage, uploadFoodImage }