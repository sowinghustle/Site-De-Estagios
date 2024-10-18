import {
    Alert,
    Button,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    StyleSheet,
    Switch,
    Pressable,
    View,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";

export default function signup() {
    const [click, setClick] = useState(false);
    const { username, setUsername } = useState("");
    const { email, setEmail } = useState("");
    const { password, setPassword } = useState("");

    return (
        <SafeAreaView style={styles.container}>
            <Text>Bem-Vindo ao Sistema</Text>
            <View>
                <Text>Endereço de email</Text>
                <TextInput
                    placeholder="Digite seu Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Text>Senha</Text>
                <TextInput
                    placeholder="Digite sua senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Text>
                    Esqueceu sua senha?
                    <Text>Redefinir Senha</Text>
                </Text>
            </View>
            <View>
                <Pressable>
                    <Link href={'../home'}>
                        <Text>Entrar</Text>
                    </Link>
                </Pressable>
            </View>
            <Text>
                Ainda não tem uma conta?<Text><Link href={'../signup'}>Registre-se</Link></Text>
            </Text>
            <View>
                {/* <Image source={logo} style={styles.image} resizeMode="contain"/> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,
    }
})
