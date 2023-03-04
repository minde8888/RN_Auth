import { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { FormErrors } from '../pages/LoginScreen';

interface Props {
    error: string;
    setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

const Popup = ({ error, setFormErrors }: Props) => {
    const [visible, setVisible] = useState(true);

    const hideAlert = () => {
        setVisible(false);
        const errorMsg: FormErrors = { errors: '' };
        setFormErrors(errorMsg);
    };

    return visible ? (
        <View style={styles.overlay}>
            <View style={styles.alert}>
                <Text style={styles.message}>{error}</Text>
                <TouchableOpacity onPress={hideAlert} style={styles.button}>
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    ) : null;
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    alert: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Popup;