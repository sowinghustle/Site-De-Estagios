import {
    SafeAreaView,
    Text,
    View,
    StyleSheet
} from "react-native";
export default function HomeSystemScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Tela inicial</Text>
            <View>
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems : "center",
        paddingTop: 70,
    }
})