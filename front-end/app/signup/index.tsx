import {
    Alert,
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
import { Button, ButtonText, ButtonIcon, ButtonSpinner, ButtonGroup } from '@gluestack-ui/themed';
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
                <Text>Nome Completo</Text>
                <TextInput
                    placeholder="Nome"
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
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
                <Text>Senha</Text>
                <TextInput
                    placeholder="Confirme sua senha"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Switch
                    value={click}
                    onValueChange={setClick}
                    trackColor={{ true: "green", false: "gray" }}
                />
                <Text>
                    Estou de acordo com as
                    <Text>Políticas e Diretrizes</Text>
                </Text>
            </View>
            <View>
                <Pressable onPress={() => Alert.alert("Cadastro bem sucedido!")}>
                    <Link href={'../signin'}>
                        <Text>Cadastrar-se</Text>
                    </Link>
                </Pressable>
            </View>
            <Text>
                Já tem uma conta?<Text><Link href={'../signin'}>Acessar Agora</Link></Text>
            </Text>
            <Button size="sm">
                <ButtonText>Submit</ButtonText>
            </Button>
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
