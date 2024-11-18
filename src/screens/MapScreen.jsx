import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import apiService from '../api/apiService';
import { setLocation } from '../store/currentLocationSlice';
import { useNavigation } from '@react-navigation/native';
import { debounce } from 'lodash';
import { useRoute } from '@react-navigation/native';
import { setDefaultLocation } from '../store/defaultLocationSlice';
const MapScreen = () => {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const route = useRoute();
    const handleSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setResults([]);
                return;
            }
            try {
                const response = await apiService.searchAddress(query);
                setResults(response || []);
            } catch (error) {
                console.log(error);
                Alert.alert('Lỗi', 'Có lỗi xảy ra khi tìm kiếm địa chỉ.');
            }
        }, 500),
        []
    );

    const handleChangeText = (value) => {
        setSearch(value);
        handleSearch(value);
    };

    const handlePress = (selectedLocation) => {
        try {
            const locationData = {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                address: selectedLocation.address,
            };

            const targetScreen = route.params.targetScreen;
            navigation.navigate(targetScreen, { location: locationData });
        } catch (error) {
            console.log(error);
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi chọn địa chỉ.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchbox}>
                <TouchableOpacity>
                    <AntDesign name='search1' size={24} color="red" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Tìm kiếm địa chỉ"
                    value={search}
                    onChangeText={handleChangeText}
                />
            </View>
            <FlatList
                data={results}
                keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.textContainer}
                        onPress={() => handlePress(item)}
                    >
                        <Text>{item.address}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noResultsText}>Không tìm thấy địa chỉ nào</Text>}
            />
        </View>
    );
};

export default MapScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchbox: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingLeft: 10,
        margin: 10,
        elevation: 5,
        borderRadius: 10,
        height: 45,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: 'black',
        marginLeft: 10,
    },
    textContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 10,
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
    },
    noResultsText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 10,
    },
});
