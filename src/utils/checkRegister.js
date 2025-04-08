import { getInformationRes } from '../api/restaurantApi';
import Snackbar from 'react-native-snackbar';
export default async function checkRegister({ navigation }) {
  try {
    const response = await getInformationRes(navigation);
    return response ? true : false;
  } catch (error) {
    Snackbar.show({
      text: error.message,
      duration: Snackbar.LENGTH_SHORT,
    });
    console.log(error);
  }
}
