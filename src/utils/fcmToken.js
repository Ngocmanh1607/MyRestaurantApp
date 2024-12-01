import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, Platform, PermissionsAndroid } from 'react-native';

const fetchFcmToken = async () => {
    try {
        // Kiểm tra nền tảng và phiên bản Android
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const notificationPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: 'Cấp quyền thông báo',
                    message: 'Ứng dụng cần quyền thông báo để gửi thông tin quan trọng.',
                    buttonPositive: 'Đồng ý',
                    buttonNegative: 'Hủy',
                }
            );

            if (notificationPermission !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Người dùng từ chối quyền thông báo.');

                // Hiển thị cảnh báo yêu cầu quyền
                Alert.alert(
                    'Cấp quyền thông báo',
                    'Ứng dụng này cần quyền thông báo để hoạt động đầy đủ. Vui lòng bật quyền trong cài đặt.',
                    [
                        {
                            text: 'Đi đến Cài đặt',
                            onPress: () => Linking.openSettings(), // Điều hướng đến cài đặt
                        },
                        { text: 'Hủy', style: 'cancel' },
                    ]
                );

                return null;
            }

            console.log('Người dùng đã cấp quyền POST_NOTIFICATIONS.');
        } else {
            console.log('Không cần yêu cầu quyền POST_NOTIFICATIONS.');
        }

        // Yêu cầu quyền Firebase Messaging
        const authStatus = await messaging().requestPermission();
        const permissionGranted =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!permissionGranted) {
            console.log('Người dùng từ chối quyền thông báo của Firebase.');

            Alert.alert(
                'Cấp quyền thông báo',
                'Ứng dụng cần quyền thông báo để hoạt động đầy đủ. Vui lòng bật quyền trong cài đặt.',
                [
                    {
                        text: 'Đi đến Cài đặt',
                        onPress: () => Linking.openSettings(),
                    },
                    { text: 'Hủy', style: 'cancel' },
                ]
            );

            return null;
        }

        console.log('Người dùng đã cấp quyền thông báo Firebase.');

        // Lấy FCM token
        const token = await messaging().getToken();
        if (token) {
            console.log('Mã FCM:', token);
            return token;
        } else {
            console.log('Không thể lấy mã FCM');
            return null;
        }
    } catch (error) {
        console.error('Lỗi khi lấy mã FCM:', error);
        return null;
    }
};

export default fetchFcmToken;