/*
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCjNFgxbC0RfVQWIQh6_KQRKvBy2EeRUlw",
    authDomain: "sistema-74173.firebaseapp.com",
    projectId: "sistema-74173",
    storageBucket: "sistema-74173.appspot.com",
    messagingSenderId: "353190646046",
    appId: "1:353190646046:web:adef84011d4990b044390f",
    measurementId: "G-HN84VTSGXP"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };
  */

//pra rodar esse código abaixo, precisei instalar o firebase normalmente
//[npm install firebase] e após isso, precisei atualizar com a seguinte linha de comando
//[npm install firebase@8.8.1]

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
  apiKey: "AIzaSyCjNFgxbC0RfVQWIQh6_KQRKvBy2EeRUlw",
  authDomain: "sistema-74173.firebaseapp.com",
  projectId: "sistema-74173",
  storageBucket: "sistema-74173.appspot.com",
  messagingSenderId: "353190646046",
  appId: "1:353190646046:web:adef84011d4990b044390f",
  measurementId: "G-HN84VTSGXP"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
