import Image from "next/image"
import pizza from "../../public/pizza (1).png"
import { Button } from "../buttons"

export const HomePage = ()=>{
    return (
        <>
        <section className="w-full bg-red-600 pl-32 ">
            <div className="grid grid-cols-2 ">
                <div className="flex justify-center flex-col py-20">
                    <div className="mr-10">
                        <h1 className="text-6xl text-white mb-10">
                            Most delicious pizza in town, now on your doorsteps
                        </h1>
                        <Button >
                            get pizza now
                        </Button>
                    </div>
                </div>
                <div
                >
                    <Image
                        src={pizza}
                        alt="pizza"
                        objectFit="cover"
                        className="float-right w-3/5"
                    />
                </div>
            </div>
        </section>
        </>
    )
}