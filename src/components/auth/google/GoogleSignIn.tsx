import React, { useState } from 'react';
import type { ReactElement } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

interface User {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    idToken?: string | null;
}

const GoogleSignIn = (): ReactElement => {
    const [user, setUser] = useState<User | null>(null);
    const [isSigninInProgress, setIsSigninInProgress] = useState(false);

    GoogleSignin.configure({
        webClientId: '1003607003409-at5atdbdtbugksfosk6atp57lghhn06i.apps.googleusercontent.com',
    });

    const onGoogleButtonPress = async () => {
        setIsSigninInProgress(true);

        try {
            const { idToken } = await GoogleSignin.signIn();
            console.log("idToken :" + idToken);


            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const userCredential: FirebaseAuthTypes.UserCredential = await auth().signInWithCredential(googleCredential);
            const firebaseUser: FirebaseAuthTypes.User | null = userCredential.user;

            if (firebaseUser) {
                setUser({
                    email: firebaseUser.email,
                    photoURL: firebaseUser.photoURL,
                    displayName: firebaseUser.displayName,
                    idToken: idToken
                });
            }
        } catch (error: any) {
            console.error('Error:', error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.error('User cancelled the login flow');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.error('Operation (e.g. sign in) is in progress already');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.error('Play services not available or outdated');
            } else {
                console.error('Some other error happened');
            }
        } finally {
            setIsSigninInProgress(false);
        }
    };

    return (
        <View>
            {user ? (
                <View>
                    <Text>Email: {user.email}</Text>
                    <Text>id Token: {user.idToken}</Text>
                </View>
            ) : (
                <GoogleSigninButton
                    style={styles.googleButton}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={onGoogleButtonPress}
                    disabled={isSigninInProgress}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    googleButton: {
        width: 192,
        height: 48,
        alignSelf: 'center',
        marginBottom: 24,
    },
});

export default GoogleSignIn;
