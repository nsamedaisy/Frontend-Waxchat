"use client";
import React, { useState } from "react";
import PulseLoader from "../atoms/pulseLoader";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase/client";
import { LOCAL_STORAGE } from "../../../utils/service/storage";

const Signupb = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async () => {
    setIsLoading(true);
    const googleUser = JSON.parse(
      localStorage.getItem("sb-xkwspfurbsmpwwazlkmu-auth-token") || "{}"
    );
    const { data } = await supabase.from("user").select("email");
    let res = data?.filter((i) => i.email === googleUser.user.email);
    if (res?.length === 1) {
      LOCAL_STORAGE.save("email", googleUser.user.email);
      setSuccess("Welcome back 🙂");
      router.push("/discussions");
      setIsLoading(false);
      return;
    }
    if (res?.length === 0) {
      LOCAL_STORAGE.save("email", googleUser.user.email);
      const { data, error } = await supabase.from("user").insert({
        email: googleUser.user.email,
        name: googleUser.user.user_metadata.name,
        image: googleUser.user.user_metadata.picture,
        phone: googleUser.user.identities.phone,
      });
      if (error) console.log("an error occured while sending user", error);
      console.log("data from DB", data);
      router.push("/discussions");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded mt-20 border border-gray-200 py-8 w-[75vw] items-center justify-center text-center mobile:max-sm:px-5">
      <h1 className="text-3xl font-extrabold text-themecolor font-serif">
        Welcome to <span className="text-4xl"> WAXCHAT</span> WEB
      </h1>
      <h4 className="mt-8 mb-6 font-bold text-xl text-gray-950">
        Read our <span className="text-themecolor">Privacy Policy</span>. Tap
        &apos;Agree and Continue&apos; to accept the{" "}
        <span className="text-themecolor">Terms of Service</span>
      </h4>
      <button
        onClick={() => handleInputChange()}
        className="border p-4 px-5 text-base font-extrabold text-black rounded"
      >
        {isLoading ? <PulseLoader /> : "Agree and Continue"}
      </button>
      <p className="text-2xl mt-6 font-extrabold text-themecolor">success</p>
    </div>
  );
};

export default Signupb;
