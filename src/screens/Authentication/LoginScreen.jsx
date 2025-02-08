import { Text, TextInput, TouchableOpacity, View, Image, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { loginApi } from '../../api/restaurantApi';
import PasswordInput from '../../components/PasswordInput';
import styles from '../../styles/LoginStyle';
const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false );
    const validate = () => {
        let valid = true;
        let errors = {};
        // Validate email
        if (!email) {
            valid = false;
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            valid = false;
            errors.email = 'Email address is invalid';
        }
        // Validate password
        if (!password) {
            valid = false;
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            valid = false;
            errors.password = 'Password must be at least 6 characters';
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validate()) {
            try{
                setLoading(true);
            const response = await loginApi(email, password);
            if (response) {
                Alert.alert('Login Successful', `Welcome, ${email}!`);
                navigation.navigate('Trang chủ');
            }}
            catch(error){
                Alert.alert('Lỗi',error.message);
                setErrors({ apiError: error.message });
            }
            finally{
                setLoading(false);
            }
        } 
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {loading?<View style={styles.containerLoading} >   
                <ActivityIndicator size={'large'} color={'#FF0000'}/>
                </View>:
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
                        placeholderText="Password"
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <TouchableOpacity>
                        <Text style={styles.forgotPassText}>Forget password?</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity
                        style={styles.loginButtonContainer}
                        onPress={handleSubmit}>
                        <Text style={styles.textLogin}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.horizontalLine} />
                <View>
                    <TouchableOpacity style={styles.googleButtonContainer}>
                        <Image source={require("../../access/Images/ic_google.png")} style={styles.topImage} />
                        <Text style={styles.textLoginGoogle}>Login with Google</Text>
                    </TouchableOpacity>
                </View>
            </View>}
            
        </TouchableWithoutFeedback>
    );
};

export default LoginScreen;
