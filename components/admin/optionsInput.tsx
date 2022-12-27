import { ErrorMessage } from "formik"


export const OptionsInput = ()=>{
    
    return(
        <div>
            <label
                htmlFor="options_text"
                className="uppercase text-sm text-gray-600 font-bold"
            >
                text
                <input
                name="options_text"
                aria-label="enter your text"
                aria-required="true"
                placeholder="enter your text"
                type="text"
                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                />
            </label>
            <ErrorMessage name="options_text" ></ErrorMessage>
            <label
                htmlFor="options_price"
                className="uppercase text-sm text-gray-600 font-bold"
            >
                text
                <input
                name="options_price"
                aria-label="enter your price"
                aria-required="true"
                placeholder="enter your price"
                type="number"
                className="w-full bg-gray-300 text-gray-900 mt-2 p-3"
                />
            </label>
            <ErrorMessage name="options_price" ></ErrorMessage>
        </div>
    )
}