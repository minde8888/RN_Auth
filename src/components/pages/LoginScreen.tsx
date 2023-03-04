import TextInput from '../textInput/TextInput';
import { View, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler, FieldValues } from 'react-hook-form';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/store';
import { loginSuccess } from '../../redux/slice/authSlice';
import Popup from '../popup/Popup';
import GoogleSignIn from '../auth/google/GoogleSignIn';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { login } from '../../services/authServices/authServices';

export type FormErrors = { email?: string, password?: string, errors?: string };

const LoginScreen = () => {

    const dispatch = useAppDispatch();
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [response, setResponse] = useState<undefined | { status: string }>();
    const methods = useForm<FieldValues>({});

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const auth = await login(data.email, data.password);
        if (auth.errors) {
            const errorMsg: FormErrors = {
                errors: auth.errors
            };
            setFormErrors(errorMsg);
        } else {
            setFormErrors({});
            setResponse({ status: 'success' });
            methods.reset();
        }
    };

    const onError: SubmitErrorHandler<FieldValues> = (errors) => {
        const errorMsg: FormErrors = {
            email: typeof errors.email?.message === 'string' ? errors.email.message : undefined,
            password: typeof errors.password?.message === 'string' ? errors.password.message : undefined
        };
        setFormErrors(errorMsg);
    };

    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    const renderError = (fieldName: keyof FormErrors) => {
        if (formErrors[fieldName]) {
            return <Text style={styles.errorMessage}>{formErrors[fieldName]}</Text>;
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.login}>
                <View>
                    <Text style={styles.title}>Login</Text>
                </View>
            </View>
            <FormProvider {...methods}>
                {formErrors.errors && <Text style={styles.errorMessage}>{<Popup error={formErrors.errors} setFormErrors={setFormErrors} />}</Text>}
                <TextInput
                    name="email"
                    label="Email"
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    rules={{
                        required: 'Email is required!',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                        }
                    }}
                />
                {renderError('email')}
                <TextInput
                    name="password"
                    label="Password"
                    placeholder="********"
                    secureTextEntry
                    rules={{
                        required: 'Password is required!',
                        pattern: {
                            value: passwordRegex,
                            message: 'Password must have 8 symbol one uppercase and one symbol (e.g. !)'
                        }
                    }}
                />
                {renderError('password')}
            </FormProvider>
            <View style={styles.button}>
                <TouchableOpacity
                    disabled={response !== undefined}
                    onPress={methods.handleSubmit(onSubmit, onError)}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
            <View>
                <GoogleSignIn />
            </View>
        </View>
    );
};



const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    login: {
        alignItems: 'center',
        backgroundColor: '#0e101c'
    },
    title: {
        fontSize: Platform.select({
            ios: 34,
            android: 30
        }),
        color: 'white'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#0e101c',
        width: '100%',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginTop: 8,
    },
    button: {
        backgroundColor: '#f194ff',
        height: 56,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        width: screenWidth >= 768 ? '50%' : '100%',
        alignSelf: screenWidth >= 768 ? 'center' : 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default LoginScreen;