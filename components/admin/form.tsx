import { ErrorMessage, Field, FieldArray, Formik, Form as FormikForm, getIn } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from 'yup';
import { trpc } from "../../src/utils/trpc";




const Form = ()=>{
    const [file,setFile] = useState("");
    const [disable,setDisable] = useState(false)
    const router = useRouter()

    const {mutate,data} = trpc.product.createProduct.useMutation({
      onSuccess:()=>{
        setDisable(false)
        console.log("done")
      },
      onError:()=>{
        setDisable(false)
      }
    });



    useEffect(()=>{
      if(data !== undefined){
          router.replace(router.asPath)
      }
  },[data])
    function handleChange(event:any){
      setFile(event.target.files[0])
    }
  
        return (
          <>
              <Formik
                  initialValues={{title:"",description:'',regular:0,medium:0,large:0,options:[]}}
                  validationSchema={Yup.object({
                    title: Yup.string().required().max(20,"character should be less than 20"),
                    description: Yup.string().required().max(150,"character should be less than 150"),
                    regular:Yup.number().required(),
                    medium:Yup.number().required(),
                    large:Yup.number().required(),
                    options:Yup.array()
                      .of(
                        Yup.object().shape({
                          text:Yup.string().min(4,'too short').required('Required'),
                          price:Yup.number().required("required")
                        })
                      )
                  })}
                  onSubmit={async (values, { setSubmitting }) => {
                    console.log(values.options)
                    setDisable(true)
                    console.log("done")
                    try{
                    const data = new FormData;
                    data.append("file",file)
                    data.append("upload_preset", "uploads");
                      const response = await fetch("https://api.cloudinary.com/v1_1/donohd08r/image/upload",{
                        method:"POST",
                        body:data
                      })
                      const uploadData = await response.json();
                      const image = uploadData.secure_url;
                      const size = [
                        {size:"REGULAR",price:values.regular},
                        {size:"MEDIUM",price:values.medium},
                        {size:"LARGE",price:values.large}
                      ]
                      console.log(size)
                      mutate({
                        title:values.title,
                        description:values.description,
                        image:image,
                        size:size,
                        options:values.options
                      })
                      values.title="";
                      values.description="";
                      values.regular = 0;
                      values.medium = 0;
                      values.large = 0;
                      values.options= []
                    } catch(e){
                      console.log(e)
                    }
                    setSubmitting(false);
                  }}
              >
              {({ values }) => (
              <FormikForm>
                    <label
                      htmlFor="title"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      Title 
                      <Field
                        name="title"
                        aria-label="enter your title"
                        aria-required="true"
                        type="text"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                      />
                    </label>
                    <ErrorMessage name="title" ></ErrorMessage>
                    <label
                      htmlFor="description"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      Description
                      <Field
                        name="description"
                        aria-label="enter your title"
                        aria-required="true"
                        type="text"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                      />
                    </label>
                    <ErrorMessage name="description" ></ErrorMessage>
  
                  <label
                      htmlFor="regular"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      regular
                      <Field
                        name="regular"
                        aria-label="enter your size"
                        aria-required="true"
                        type="number"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                      />
                    </label>
                  <label
                      htmlFor="medium"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      medium
                      <Field
                        name="medium"
                        aria-label="enter your size"
                        aria-required="true"
                        type="number"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                      />
                    </label>
                  <label
                      htmlFor="large"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      large
                      <Field
                        name="large"
                        aria-label="enter your size"
                        aria-required="true"
                        type="number"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                      />
                    </label>
                    <label
                      htmlFor="image"
                      className="uppercase text-sm text-gray-600 font-bold"
                    >
                      INPUT A FILE
                      <input
                        name="image"
                        aria-label="enter your image"
                        aria-required="true"
                        type="file"
                        className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                        onChange={handleChange}
                      />
                    </label>
                    <ErrorMessage name="file" ></ErrorMessage>
                    <div>
                      <h1 className="uppercase text-sm text-gray-600 font-bold">add options</h1>
                      <div className="w-full bg-gray-300 text-gray-900 mt-2 p-3 flex flex-col ">
                        <FieldArray
                            name="options"
                            render={arrayHelpers => (
                              <div>
                                {
                                  values.options && values.options.length > 0 ? (
                                    values.options.map((items,index)=> (
                                      <div key={index}>
                                        <Field 
                                          name={`options[${index}].text`}
                                          type="text"
                                        />
                                         <ErrorMessage name={`options[${index}].text`} />
                                        <Field 
                                          name={`options[${index}].price`}
                                          type="number"
                                        />
                                         <ErrorMessage name={`options[${index}].price`} />
                                        <button 
                                          type="button"
                                          onClick={()=> arrayHelpers.remove(index)}
                                          className="px-4 py-2 rounded bg-blue-600 text-white"
                                        >
                                          -
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                          className="px-4 py-2 rounded bg-blue-600 text-white"
                                        >
                                          +
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <button type="button" onClick={() => arrayHelpers.push('')} className="px-4 py-2 rounded bg-blue-600 text-white">
                                      {/* show this when user has removed all friends from the list */}
                                      Add a option
                                    </button>
                                  )
                                }
                            </div>
                          )}
                        />
                      </div>  
                    </div>
                  <button type="submit" 
                    className={ disable ? "px-4 py-2 rounded bg-blue-300 text-white" : "px-4 py-2 rounded bg-blue-600 text-white" }
                    disabled={disable} 
                  >submit
                  </button>
              </FormikForm> 
              )}
              </Formik>
          </>
        )
}

export default Form