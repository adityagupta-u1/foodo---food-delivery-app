import Razorpay from "razorpay";
import { env } from "../env/server.mjs";

export async function instanceFunction(keyId:string,keySecret:string){
  const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

return instance
}


export  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
};