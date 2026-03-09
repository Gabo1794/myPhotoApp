// DEPRECATED: Este archivo está siendo reemplazado por Supabase
// Mirar: src/services/supabase/SupabaseAuthService.ts

export const SignInWithEmailAndPassword = async (username, password) => {
    throw new Error('Use Supabase auth service instead');
};
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