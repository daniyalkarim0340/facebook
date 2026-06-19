import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAX6jiRMCk5jBtzAicfyD3YJS_DrAqS_0U",
//   authDomain: "chatbot-17c1f.firebaseapp.com",
//   projectId: "chatbot-17c1f",
//   storageBucket: "chatbot-17c1f.firebasestorage.app",
//   messagingSenderId: "302676200775",
//   appId: "1:302676200775:web:a6b987e6d381c8fa90d062",
//   measurementId: "G-THCRRN0TWQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);