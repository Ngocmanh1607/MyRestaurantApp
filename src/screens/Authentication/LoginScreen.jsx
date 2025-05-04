import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { loginApi, resetPasswordApi } from '../../api/restaurantApi';
import PasswordInput from '../../components/PasswordInput';
import styles from '../../assets/css/LoginStyle';
import checkRegister from '../../utils/checkRegister';
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isResetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState({});

  const validate = () => {
    let valid = true;
    let errors = {};
    // Validate email
    if (!email) {
      valid = false;
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      errors.email = 'Không đúng định dạng';
    }
    // Validate password
    if (!password) {
      valid = false;
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      valid = false;
      errors.password = 'Mật khẩu chứa ít nhất 6 ký tự';
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      try {
        setLoading(true);
        const response = await loginApi(email, password);

        if (!response.success) {
          Alert.alert('Lỗi', response.message || 'Đăng nhập thất bại');
          setErrors({ apiError: response.message });
          return;
        }
        await checkRegisterInfo();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể kết nối đến server');
        setErrors({ apiError: 'Lỗi kết nối' });
      } finally {
        setLoading(false);
      }
    }
  };

  const checkRegisterInfo = async () => {
    try {
      const res = await checkRegister(navigation);
      if (res) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Register' }],
        });
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kiểm tra thông tin đăng ký');
    }
  };

  const handleResetPassword = async () => {
    // Validate inputs
    let valid = true;
    let errors = {};

    if (!resetEmail) {
      valid = false;
      errors.resetEmail = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      valid = false;
      errors.resetEmail = 'Địa chỉ email không hợp lệ';
    }

    if (!newPassword) {
      valid = false;
      errors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (newPassword.length < 6) {
      valid = false;
      errors.newPassword = 'Mật khẩu phải chứa ít nhất 6 kí tự';
    }

    setResetErrors(errors);

    if (valid) {
      setLoading(true);
      try {
        // Call your reset password API here
        await resetPasswordApi(resetEmail, newPassword);
        Alert.alert('Thành công', 'Mật khẩu đã được cập nhật');
        setResetModalVisible(false);
        setResetEmail('');
        setNewPassword('');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau');
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {loading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size={'large'} color={'#FF0000'} />
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <View style={styles.inputContainer}>
              <Fontisto
                name="email"
                color="#9a9a9a"
                size={22}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#A9A9A9"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholderText="Mật khẩu"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity onPress={() => setResetModalVisible(true)}>
              <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={styles.loginButtonContainer}
              onPress={handleSubmit}>
              <Text style={styles.textLogin}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isResetModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setResetModalVisible(false)}>
            <TouchableWithoutFeedback
              onPress={() => setResetModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Đặt lại mật khẩu</Text>
                      <TouchableOpacity
                        onPress={() => setResetModalVisible(false)}>
                        <Fontisto name="close" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[styles.inputContainer, { marginHorizontal: 10 }]}>
                      <Fontisto
                        name="email"
                        color="#9a9a9a"
                        size={22}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Email"
                        placeholderTextColor="#A9A9A9"
                        value={resetEmail}
                        onChangeText={setResetEmail}
                      />
                    </View>
                    {resetErrors.resetEmail && (
                      <Text style={styles.errorText}>
                        {resetErrors.resetEmail}
                      </Text>
                    )}
                    <View style={{ marginHorizontal: -30 }}>
                      <PasswordInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholderText="Mật khẩu mới"
                      />
                    </View>
                    {resetErrors.newPassword && (
                      <Text style={styles.errorText}>
                        {resetErrors.newPassword}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={handleResetPassword}>
                      <Text style={styles.resetButtonText}>
                        Đặt lại mật khẩu
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
