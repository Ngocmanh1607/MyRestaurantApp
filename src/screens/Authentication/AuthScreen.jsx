import { Text, View, LogBox, useWindowDimensions, Animated, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import styles from '../../access/css/AuthStyle';
const TabScreen = () => {
    LogBox.ignoreLogs([
        'A props object containing a "key" prop is being spread into JSX'
    ]);
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'login', title: 'Đăng nhập' },
        { key: 'signup', title: 'Đăng ký' },
    ]);
    const renderScene = SceneMap({
        login: LoginScreen,
        signup: SignupScreen,
    });
    const renderTabBar = props => {
        const { key, ...restProps } = props;
        return (
            <TabBar
                {...restProps}
                indicatorStyle={styles.indicator}
                style={styles.tabBar}
                renderLabel={({ route, focused }) => (
                    <Text style={[styles.label, { color: focused ? '#FF0000' : 'black' }]}>
                        {route.title}
                    </Text>
                )}
            />
        )
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
};
const AuthScreen = () => {
    const slideAnim = useRef(new Animated.Value(1000)).current; // Bắt đầu từ vị trí ngoài màn hình (dưới)

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [slideAnim]);
    return (
        <View style={styles.container}>
            <View style={styles.topImageContainer}>
                <Image source={require("../../access/Images/Restaurant.png")} style={styles.topImage} />
            </View>
            <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: slideAnim }] }]}>
                <TabScreen />
            </Animated.View>
        </View>

    );
};
export default AuthScreen;