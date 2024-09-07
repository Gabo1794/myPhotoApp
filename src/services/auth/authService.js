import { auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const SignInWithEmailAndPassword = async (username, password) => {
    return new Promise(async (resolve, reject) => {
        try
        {
            let response = await signInWithEmailAndPassword(
                auth,
                username,
                password
            );
            resolve(response);
        }
        catch(err)
        {
            reject(err);
        }        
    });
};

export const LogOut = () => {
    auth.signOut();
};