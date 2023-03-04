import { NavigationContainer } from '@react-navigation/native';
import { createContext, useState } from 'react';

interface AuthContextProps {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
  setIsAuth: () => { },
});

const AuthProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };