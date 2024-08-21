import { TouchableOpacity, Text } from "react-native";
import { Entypo } from '@expo/vector-icons'; 
import { StyleSheet } from 'react-native'
import React from "react";

export default Button = ({title, onPress, icon, color}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Entypo name={icon} size={30} color={color ? color : '#f1f1f1'}/>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        minWidth: 90,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000',
    }
})