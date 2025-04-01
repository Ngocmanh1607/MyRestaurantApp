import { Text, TextInput, TouchableOpacity, View, Image, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { loginApi } from '../../api/restaurantApi';
import PasswordInput from '../../components/PasswordInput';
import styles from '../../assets/css/LoginStyle';
const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
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
                if (response) {
                    navigation.navigate('Home');
                }
            }
            catch (error) {
                Alert.alert('Lỗi', error.message);
                setErrors({ apiError: error.message });
            }
            finally {
                setLoading(false);
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {loading ? <View style={styles.containerLoading} >
                <ActivityIndicator size={'large'} color={'#FF0000'} />
            </View> :
                <View style={styles.container}>
                    <View>
                        <View style={styles.inputContainer}>
                            <Fontisto name="email" color="#9a9a9a" size={22} style={styles.inputIcon} />
                            <TextInput
                                style={styles.textInput}
                                placeholder='Email'
                                placeholderTextColor='#A9A9A9'
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
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <TouchableOpacity>
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

                    <View style={styles.horizontalLine} />
                    <View>
                        <TouchableOpacity style={styles.googleButtonContainer}>
                            <Image source={require("../../assets/Images/ic_google.png")} style={styles.topImage} />
                            <Text style={styles.textLoginGoogle}>Đăng nhập với Google</Text>
                        </TouchableOpacity>
                    </View>
                </View>}

        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
