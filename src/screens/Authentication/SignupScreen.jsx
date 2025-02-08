import { Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import PasswordInput from '../../components/PasswordInput';
import { useNavigation } from '@react-navigation/native';
import { signupApi } from '../../api/restaurantApi'; // Import API
import styles from '../../styles/SignupStyle';

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
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            valid = false;
            errors.email = 'Email address is invalid';
        }
        if (!password) {
            valid = false;
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            valid = false;
            errors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            valid = false;
            errors.confirmPassword = 'Confirm Password is required';
        } else if (password !== confirmPassword) {
            valid = false;
            errors.confirmPassword = 'Passwords do not match';
        }

        setErrors(errors);
        return valid;
    };

    const handleSignUp = async () => {
        if (validate()) {
            setLoading(true);
            try {
                const response = await signupApi(email, password); // Gọi API đăng ký
                navigation.navigate('Đăng kí thông tin');
            } catch (error) {
                setErrors({ apiError: error.message });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.inputSignContainer}>
                    <Fontisto name="email" color="#9a9a9a" size={22} style={styles.inputIcon} />
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
                    placeholderText="Password"
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <PasswordInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderText="Confirm Password"
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

                {errors.apiError && <Text style={styles.errorText}>{errors.apiError}</Text>}

                <TouchableOpacity style={styles.loginButtonContainer} onPress={handleSignUp} disabled={loading}>
                    <Text style={styles.textLogin}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SignupScreen;
