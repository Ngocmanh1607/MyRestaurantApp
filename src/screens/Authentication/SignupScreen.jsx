import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import PasswordInput from '../../components/PasswordInput';
import { useNavigation } from '@react-navigation/native';
import { signupApi } from '../../api/restaurantApi'; // Import API
import styles from '../../assets/css/SignupStyle';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading

  const validate = () => {
    let valid = true;
    let errors = {};
    if (!email) {
      valid = false;
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      valid = false;
      errors.email = 'Email đã tồn tại';
    }
    if (!password) {
      valid = false;
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      valid = false;
      errors.password = 'Mật khẩu chứa ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      valid = false;
      errors.confirmPassword = 'Xác nhân mật khẩu là bắt buộc';
    } else if (password !== confirmPassword) {
      valid = false;
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    setErrors(errors);
    return valid;
  };

  const handleSignUp = async () => {
    if (validate()) {
      try {
        setLoading(true);
        await signupApi(email, password);
        navigation.navigate('Đăng kí thông tin');
      } catch (error) {
        Alert.alert('Lỗi', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.inputSignContainer}>
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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholderText="Mật khẩu"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderText="Xác nhận mật khẩu"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        {errors.apiError && (
          <Text style={styles.errorText}>{errors.apiError}</Text>
        )}

        <TouchableOpacity
          style={styles.loginButtonContainer}
          onPress={handleSignUp}
          disabled={loading}>
          <Text style={styles.textLogin}>
            {loading ? 'Đang đăng ký ...' : 'Đăng ký'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;
