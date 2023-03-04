import {
    View,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    Text,
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import {
    useController,
    useFormContext,
    UseControllerProps,
    useWatch
} from 'react-hook-form';

interface TextInputProps extends RNTextInputProps, UseControllerProps {
    label: string
    defaultValue?: string
    errorMessage?: string | undefined
}

const TextInput = (props: TextInputProps) => {

    const { name } = props;

    const formContext = useFormContext();

    if (!formContext || !name) {
        const msg = !formContext ? "TextInput must be wrapped by the FormProvider" : "Name must be defined"
        console.error(msg)
        return null
    }
    return <ControlledInput {...props} />;
};

const ControlledInput = (props: TextInputProps) => {
    const {
        name,
        label,
        rules,
        errorMessage,
        defaultValue = '',
        ...inputProps
    } = props;

    const { field } = useController({ name, rules, defaultValue });

    return (
        <View style={styles.inputContainer}>
            {label && (<Text style={styles.label}>{label}</Text>)}
            <RNTextInput
                style={styles.input}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                value={field.value}
                {...inputProps}
            />
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    formContainer: {
        marginTop: 48,
    },
    inputContainer: {
        marginTop: 16,
        flexDirection: screenWidth >= 768 ? 'row' : 'column',
    },
    label: {
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
        textAlign: 'left',
        paddingRight: screenWidth >= 768 ? 16 : 0,
        width: screenWidth >= 768 ? '25%' : '100%',
    },
    input: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: Platform.select({
            ios: 16,
            android: 14,
        }),
        width: screenWidth >= 768 ? '50%' : '100%',
        alignSelf: screenWidth >= 768 ? 'center' : 'flex-start',
    },
});

export default TextInput;