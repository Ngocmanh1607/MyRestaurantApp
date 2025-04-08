import { uploadImageToCloudinary } from './cloudinaryUtils';

const uploadRestaurantImage = async (userId, imageUri) => {
  try {
    const downloadURL = await uploadImageToCloudinary(
      userId,
      imageUri,
      'restaurant_image'
    );
    return downloadURL;
  } catch (error) {
    console.error('Error uploading food image:', error);
    throw error;
  }
};

const uploadFoodImage = async (restaurantId, foodName, imageUri) => {
  try {
    const downloadURL = await uploadImageToCloudinary(
      restaurantId,
      imageUri,
      foodName
    );
    return downloadURL;
  } catch (error) {
    console.error('Error uploading food image:', error);
    throw error;
  }
};
export { uploadRestaurantImage, uploadFoodImage };
