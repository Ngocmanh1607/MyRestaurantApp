// Hàm upload ảnh lên Firebase Storage và lấy URL cho nhà hàng
import { storage, firestore } from './firebase';
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

// Hàm upload ảnh món ăn lên Firebase Storage và lấy URL
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

// Hàm lưu URL ảnh nhà hàng vào Firestore
const saveRestaurantImageUrlToDatabase = async (restaurantId, imageUrl) => {
    try {
        const restaurantRef = firestore.collection('restaurants').doc(restaurantId);
        await restaurantRef.set({
            restaurantImage: imageUrl,
        }, { merge: true });

        console.log('Lưu URL ảnh nhà hàng vào Firestore thành công');
    } catch (error) {
        console.log('Lỗi khi lưu URL vào Firestore:', error);
    }
};

// Hàm lưu URL ảnh món ăn vào Firestore
const saveFoodImageUrlToDatabase = async (restaurantId, foodId, imageUrl) => {
    try {
        const restaurantRef = firestore.collection('restaurants').doc(restaurantId);
        const restaurantDoc = await restaurantRef.get();
        const menu = restaurantDoc.data().menu || [];

        // Cập nhật hoặc thêm món ăn với foodId vào menu
        const updatedMenu = menu.map(item =>
            item.foodId === foodId ? { ...item, foodImage: imageUrl } : item
        );

        // Cập nhật menu vào Firestore
        await restaurantRef.update({
            menu: updatedMenu,
        });

        console.log('Lưu URL ảnh món ăn vào Firestore thành công');
    } catch (error) {
        console.log('Lỗi khi lưu URL ảnh món ăn vào Firestore:', error);
    }
};

export { uploadRestaurantImage, uploadFoodImage, saveRestaurantImageUrlToDatabase, saveFoodImageUrlToDatabase }