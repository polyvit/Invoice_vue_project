import { initializeApp } from "firebase/app";
// import { firebase } from "firebase/app";
// import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcPDPPfy49hFtvQQd0TGX8M8-KFrz2Umo",
  authDomain: "invoice-vue-74186.firebaseapp.com",
  projectId: "invoice-vue-74186",
  storageBucket: "invoice-vue-74186.appspot.com",
  messagingSenderId: "767210530939",
  appId: "1:767210530939:web:7c770e22fbbdca51265ade",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const db = firebase.firestore();
