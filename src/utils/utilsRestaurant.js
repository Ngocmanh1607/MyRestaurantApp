
import { launchImageLibrary } from "react-native-image-picker"
import { uploadRestaurantImage } from "./firebaseUtils";
import Snackbar from "react-native-snackbar";
const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const selectedImage = response.assets[0];
            return selectImage;
        }
    })
}
const uploadImage = async (userId, image) => {
    try {
        if (image && userId) {
            const url = await uploadRestaurantImage(userId, image);
            Snackbar.show({
                text: 'Ảnh đã được cập nhật!',
                duration: Snackbar.LENGTH_SHORT,
            });
            return { success: true, url };
        } else {
            Snackbar.show({
                text: 'Không có ảnh nào được chọn hoặc thiếu userId',
                duration: Snackbar.LENGTH_SHORT,
            });
            return { success: false, message: 'Missing image or userId' };
        }
    } catch (error) {
        console.error('Upload image failed: ', error);
        return { success: false, error };
    }
};
export { selectImage, uploadImage }