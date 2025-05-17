import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../../assets/css/WalletStyle';
import formatPrice from '../../utils/formatPrice';
import { useNavigation } from '@react-navigation/native';
import formatTime from '../../utils/formatTime';
import {
  getMoney,
  getListMoney,
  getrequestWithdrawMoney,
  requestWithdrawMoney,
  getInformationRes,
} from '../../api/restaurantApi';
import BankSelectionModal from '../../components/BankSelectionModal';
const WalletScreen = () => {
  const navigation = useNavigation();
  const [balance, setBalance] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [restauranId, setRestaurantId] = useState();
  const [transactions, setTransactions] = useState();
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');

  const [selectedBank, setSelectedBank] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);

  const [activeTab, setActiveTab] = useState('earnings');
  useEffect(() => {
    const fetchRestaurantId = async () => {
      try {
        setIsLoading(true);
        const res = await getInformationRes();
        if (res.success) {
          setRestaurantId(res.metadata.id);
        } else {
          if (res.message === 'jwt expired') {
            Alert.alert('Lỗi', 'Hết phiên làm việc. Vui lòng đăng nhập lại', [
              {
                text: 'OK',
                onPress: async () => {
                  await AsyncStorage.clear();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Auth' }],
                  });
                },
              },
            ]);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantId();
  }, []);
  useEffect(() => {
    fetchMoney();
    fetchListMoney();
    fetchListTransaction();
  }, [restauranId]);
  const fetchMoney = async () => {
    try {
      if (restauranId) {
        const response = await getMoney(restauranId);
        console.log('Số dư:', response.data);
        setBalance(response.data);
      }
    } catch (error) {}
  };
  const fetchListMoney = async () => {
    try {
      if (restauranId) {
        const response = await getListMoney(restauranId);
        console.log('Danh sách tiền:', response.data);
        setTransactions(response.data);
      }
    } catch (error) {}
  };
  const fetchListTransaction = async () => {
    try {
      if (restauranId) {
        const response = await getrequestWithdrawMoney(restauranId);
        setWithdrawalHistory(response.data.slice().reverse());
        console.log('Danh sách giao dịch:', response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giao dịch:', error.message);
    }
  };
  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      Alert.alert('Thông báo', 'Vui lòng nhập số tiền');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Thông báo', 'Số tiền không hợp lệ');
      return;
    }

    if (amount > balance) {
      Alert.alert('Thông báo', 'Số dư không đủ');
      return;
    }
    setShowWithdrawModal(false);
    const response = await requestWithdrawMoney(
      restauranId,
      withdrawAmount,
      bankAccount,
      selectedBank.name
    );
    Alert.alert(
      'Thành công',
      'Yêu cầu rút tiền của bạn đã được ghi nhận và đang được xử lý'
    );
    setWithdrawAmount('');
    setBankAccount('');
    setBankName('');
    setSelectedBank();
    fetchListTransaction();
    fetchMoney();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceTitle}>Số dư ví</Text>
            <Text style={styles.balanceAmount}>{formatPrice(balance)}</Text>
          </View>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => setShowWithdrawModal(true)}>
            <FontAwesome name="money" size={16} color="#FFF" />
            <Text style={styles.withdrawText}>Rút tiền</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction History Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'earnings' && styles.activeTab]}
          onPress={() => setActiveTab('earnings')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'earnings' && styles.activeTabText,
            ]}>
            Tiền nhận được
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'withdrawals' && styles.activeTab]}
          onPress={() => setActiveTab('withdrawals')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'withdrawals' && styles.activeTabText,
            ]}>
            Lịch sử rút tiền
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'earnings'
          ? // Earnings from completed orders
            transactions?.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.orderId}>
                    Đơn hàng #{transaction.order_id}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatTime(transaction.createdAt)}
                  </Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={styles.earnAmount}>
                    + {formatPrice(transaction.restaurant_fee)}
                  </Text>
                  <View style={styles.statusTag}>
                    <Text style={styles.statusText}>Đã nhận</Text>
                  </View>
                </View>
              </View>
            ))
          : // Withdrawal history
            withdrawalHistory?.map((withdrawal) => (
              <View key={withdrawal.id} style={styles.withdrawalItem}>
                <View style={styles.withdrawalLeft}>
                  <Text style={styles.bankInfo}>
                    {withdrawal.bank_name} - {withdrawal.account_id}
                  </Text>
                  <Text style={styles.withdrawalDate}>
                    {formatTime(withdrawal.createdAt)}
                  </Text>
                </View>
                <View style={styles.withdrawalRight}>
                  <Text style={styles.withdrawAmount}>
                    -{formatPrice(withdrawal.withdrawn_money)}
                  </Text>
                  <View style={[styles.statusTag, styles.statusTagSuccess]}>
                    <Text style={styles.statusText}>Thành công</Text>
                  </View>
                </View>
              </View>
            ))}
      </ScrollView>
      {/* Modal rút tiền */}
      <Modal
        visible={showWithdrawModal}
        animationType="fide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowWithdrawModal(false)}>
              <FontAwesome name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Rút tiền</Text>

            <TextInput
              style={styles.input}
              placeholder="Số tiền muốn rút"
              keyboardType="numeric"
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />

            <TouchableOpacity
              style={styles.bankSelector}
              onPress={() => setShowBankModal(true)}>
              <Text style={styles.bankSelectorText}>
                {selectedBank ? selectedBank.name : 'Chọn ngân hàng'}
              </Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Số tài khoản"
              keyboardType="numeric"
              value={bankAccount}
              onChangeText={setBankAccount}
            />
            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Xác nhận rút tiền</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BankSelectionModal
          visible={showBankModal}
          onClose={() => setShowBankModal(false)}
          onSelectBank={setSelectedBank}
          selectedBank={selectedBank}
        />
      </Modal>
    </View>
  );
};

export default WalletScreen;
