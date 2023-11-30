import Image from "next/image";
import React from "react";
import GoogleButton from "../atoms/googleButton";

const Signnuppage = () => {
  return (
    <div>
      <div className="flex flex-col justify-center mt-2 xl:mt w-[75vw] mobile:max-sm:w-[95%]">
        <div className="flex items-center gap-4 text-white">
          <Image src={"/logo.png"} width={60} height={60} alt={""} />
          <p className="font-bold text-xl">WAXCHAT WEB</p>
        </div>

        <div className="bg-white mobile:max-sm:ml-2 flex flex-col justify-center w-full p-20 mobile:max-sm:p-5 mt-8 rounded drop-shadow">
          <h2 className="text-center text-5xl font-extrabold themecolor font-serif mb-4">
            Log Into WaxChat Using Just your Google Account
          </h2>
          <p className="text-center text-slate-500 mb-6">
            Cross plateform web messaging with friends and family all over the
            Globe.
          </p>
          <GoogleButton />
        </div>
      </div>
    </div>
  );
};

export default Signnuppage;
