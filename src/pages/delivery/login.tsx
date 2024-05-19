import { ErrorMessage, Field, Formik } from "formik";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup';


 const LogIn = ()=>{
    const [error,setError] = useState("");
    const router = useRouter();
    return(
        <>
            <Formik
                initialValues={{email:'',password:''}}
                validationSchema={Yup.object({
                    email: Yup.string()
                    .max(30, 'Must be 30 characters or less')
                    .email('Invalid email address')
                    .required('Please enter your email'),
                  password: Yup.string().required('Please enter your password'),
                })}
                onSubmit={async (values, { setSubmitting }) => {
                  const res = await signIn('credentials', {
                    redirect: false,
                    method:"login",
                    email: values.email,
                    password: values.password,
                    callbackUrl: `/`,
                    role:"DELIVERY"
                  });
                  if (res?.error) {
                    setError(res?.error);
                    console.log(error)
                  } else {
                    setError("");
                  }
                  if (res?.url) router.push(res?.url);
                  setSubmitting(false);
                }}
            >
            {(formik) => (
            <form onSubmit={formik.handleSubmit}>
                {
                    error ? (
                      <div>{error}</div>
                    ) : null
                }
                <label
                    htmlFor="email"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                    email
                    <Field
                      name="email"
                      aria-label="enter your email"
                      aria-required="true"
                      type="text"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>
                  <ErrorMessage name="email"/>
                <label
                    htmlFor="password"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                    password
                    <Field
                      name="password"
                      aria-label="enter your password"
                      aria-required="true"
                      type="password"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>
                  <ErrorMessage name="password"/>
                <button type="submit" >login</button>
            </form> 
            )}
            </Formik>
            <button onClick={() => { signIn("google",{callbackUrl:'/'}) }}>sign in with google</button>
        </>
    )
}

export default LogIn;