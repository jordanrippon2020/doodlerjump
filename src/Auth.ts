import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export class Auth {
    currentUser: User | null = null;
    onUserChange: (user: User | null) => void;

    constructor(onUserChange: (user: User | null) => void) {
        this.onUserChange = onUserChange;

        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.onUserChange(user);
        });
    }

    async signIn() {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in", error);
        }
    }

    async signOut() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    }
}
