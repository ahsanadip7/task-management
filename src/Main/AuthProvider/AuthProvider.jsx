import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut 
} from 'firebase/auth';
import { auth } from '../../__firebase.init';

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const signInUser = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const signOutUser = () => signOut(auth);
    const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unSubscribe;
    }, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        isDarkMode,
        toggleTheme,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

// PropTypes Validation
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
