import { ErrorMessage, Field, Formik } from "formik";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup';


 const LogIn = ()=>{
    const [error,setError] = useState("");
    const router = useRouter();
    return(
        <>
       <Formik
        initialValues={{ email: '', password: '',name:''}}
        validationSchema={Yup.object({
          email: Yup.string()
            .max(30, 'Must be 30 characters or less')
            .email('Invalid email address')
            .required('Please enter your email'),
          password: Yup.string().required('Please enter your password'),
          name:Yup.string().required('please enter your name').max(12,'Must be 12 character or less').min(2,'Must be more than 2 characters')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signIn('credentials', {
            redirect: false,
            method:"register",
            email: values.email,
            password: values.password,
            name:values.name,
            callbackUrl: `/`,
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
            <div 
            className="bg-red-400 flex flex-col items-center 
            justify-center min-h-screen py-2 shadow-lg">
              {
                error ? (
                  <>
                    <div>{error}</div>
                  </>
                ) : null
              }
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                <div className="text-red-400 text-md text-center rounded p-2">
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="name"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                    name
                    <Field
                      name="name"
                      aria-label="enter your name2"
                      aria-required="true"
                      type="text"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>

                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="name" />
                  </div>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="uppercase text-sm text-gray-600 font-bold"
                  >
                    Email
                    <Field
                      name="email"
                      aria-label="enter your email"
                      aria-required="true"
                      type="text"
                      className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                    />
                  </label>

                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="email" />
                  </div>
                </div>
                <div className="mb-6">
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

                  <div className="text-red-600 text-sm">
                    <ErrorMessage name="password" />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                {
                error && error === "This user exists" ? (
                  <button
                  type="button"
                  className="bg-green-400 text-gray-100 p-3 rounded-lg w-full"
                >
                  <Link href="/auth/login">
                    login
                  </Link>
                </button>
                ) : (
                  <button
                  type="submit"
                  className="bg-green-400 text-gray-100 p-3 rounded-lg w-full"
                >
                  {formik.isSubmitting ? 'Please wait...' : 'Sign In'}
                </button>
                )
                }
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
            <button onClick={() => { signIn("google",{callbackUrl:'/'}) }}>sign in</button>
        </>
    )
}

export default LogIn;