import React from "react";
import { IoIosArrowBack } from "react-icons/io";

const RenderGroupContact = () => {
  return (
    <div className="fixed z-[80] bg-white flex gap-5 flex-col top-[35%] left-[33%] shadow-md p-4 w-[503px] m-auto mobile:max-sm:w-[90vw] mobile:max-sm:left-2 mobile:max-sm:right-2">
      <div className="bg-teal-600 flex flex-row gap-5 items-center">
        <IoIosArrowBack color={"white"} width={50} hieght={50} />
        <p className="text-white text-[17px]">Add a member</p>
      </div>
      <div className=""></div>
    </div>
  );
};

export default RenderGroupContact;
