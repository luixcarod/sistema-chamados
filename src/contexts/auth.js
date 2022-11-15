import { useState, useEffect, createContext } from 'react';
import firebase from '../services/firebaseconection';
import { toast } from 'react-toastify';


export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        function loadStorage(){
            const storageUser = localStorage.getItem('SistemaUser');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
    
            setLoading(false);
        }
        
        loadStorage();

    }, [])

    //função que faz login do usuario
    async function signIn(email, senha){
        setLoadingAuth(true);

        await firebase.auth().signInWithEmailAndPassword(email, senha)
        .then( async (value)=>{
            let uid = value.user.uid;

            //aqui cria uma variavel que busca no banco de dados os dados do
            //usuario de acordo com o id dele
            const userProfile = await firebase.firestore().collection('users')
            .doc(uid).get();

            let data = {
                uid: uid,
                nome: userProfile.data().nome,
                avatarUrl: userProfile.data().avatarUrl,
                email: value.user.email
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success('Bem vindo de volta!');
        })
        .catch((error)=>{
            console.log("Erro ao fazer o login. Erro: " + error);
            toast.error('Ops, algo deu errado');
            setLoadingAuth(false);
        })
    }

    //função que cadastra usuario
    async function signUp(email, senha, nome){
        setLoadingAuth(true);

        await firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then( async (value) => {
            let uid = value.user.uid;

            await firebase.firestore().collection('users')
            .doc(uid).set({
                nome: nome,
                avatarUrl: null,
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                toast.success('Bem vindo a plataforma');
            })
        })
        .catch((error)=>{
            console.log("Erro ao fazer o cadastro. Erro: " + error);
            toast.error('Ops, algo deu errado');
            setLoadingAuth(false);
        })

    }

    //essa função salva o usuario que fizer o login la no localStorage, caso ele feche o 
    //navegador ou desligue o computador, na hora que voltar, ele ainda estará
    //caso ele não tenha feito o logOut
    function storageUser(data){
        localStorage.setItem("SistemaUser", JSON.stringify(data));
    }

    //função que faz logout do usuario
    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null);
    }

    return(
        <AuthContext.Provider 
        value={{ 
            signed: !!user, 
            user, 
            loading, 
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;