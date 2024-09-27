import { Button, Image, SafeAreaView, Text, TextInput, StyleSheet, View } from "react-native";
import React, { useState } from 'react';
import { Link } from "expo-router";

export default function signup(){
    const [click,setClick] = useState(false);
    const {username, setUsername} = useState("");
    const {email, setEmail} = useState("");
    const {password, setPassword} = useState("");

    return (<View>
    
    <Image source={logo} style={styles.image}

    <SafeAreaView style={styles.container}

    </View>);
}