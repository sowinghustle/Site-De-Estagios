import React from 'react'; 
import { CheckBox } from 'react-native-elements';
import { View } from 'react-native';
import styles from './styles';

const CustomCheckBox: React.FC = () => {
  
  const [checked, setChecked] = React.useState(true);
  const toggleCheckbox = () => setChecked(!checked);

    return (
      <View>
      <CheckBox
        checked={checked}
        onPress={toggleCheckbox}
        iconType="material-community"
        checkedIcon="checkbox-marked"
        uncheckedIcon="checkbox-blank-outline"
        checkedColor="#B11116"
        containerStyle={styles.containerStyle}
      />
    </View>
  );
};

export default CustomCheckBox;
