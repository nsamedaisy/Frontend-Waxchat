"use client";

import React, { useState, ChangeEvent } from "react";
import Avatar from "@/components/atoms/Avatar";
import {
  FaSearch,
  FaEllipsisV,
  FaPlus,
  FaMicrophone,
  FaLock,
  FaPaperPlane,
} from "react-icons/fa";
import { AiOutlineSmile } from "react-icons/ai";

import InfoCard from "@/components/organisms/InfoCard";

const Chats = () => {
  const [message, setMessage] = useState("");
  const [showInfoCard, setShowInfoCard] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // Handle sending message logic here
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleAvatarClick = () => {
    setShowInfoCard(!showInfoCard);
  };

  return (
    <div className="relative flex flex-col h-full">

      <div
        className={`${
          showInfoCard ? "w-full" : "w-full"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-2 bg-bgGray border-l-2 w-full ">
          <div className="flex items-center">
            <Avatar
              size={4}
              profilePicture="https://i.pinimg.com/564x/17/f7/ba/17f7baaff77ee55d8807fcd7b2d2f47a.jpg"
              onClick={handleAvatarClick}
            />
            <h1 className="ml-4 text-lg">John Doe</h1>
          </div>
          <div className="flex items-center text-gray-500 text-xl">
            <FaSearch className="mr-8" />
            <FaEllipsisV className="mr-2" />
          </div>
        </div>
      </div>

      <div className="w-full relative flex-grow overflow-auto h-[80vh]">
        <div
          // className={`${
          //   showInfoCard ? "w-full" : "w-full"
          // } bg-cover bg-no-repeat bg-center flex flex-col transition-all duration-300`}
          className="bg-fixed  w-[71.2%] h-[80%] fixed z-0"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            // backgroundSize: "cover",
          }}
        >
          <p className="rounded-md shadow-md text-gray-500 w-20 px-1 py-2 bg-white text-center text-lg ml-[45%]">
            Today
          </p>
          <p className="text-myG w-[48vw] ml-[15%] font-semibold p-2 rounded-md mt-5 flex text-sm text-center bg-yellow justify-center">
            <FaLock className="mr-2" /> Messages are end-to-end encrypted. No
            one outside of this chat, not even WaxChat, can read or listen to
            them.
          </p>
          {/* Render chat messages here */}
        </div>

        {showInfoCard && (
          <div className="w-40">
            <InfoCard />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 text-2xl text-gray-500 bg-bgGray bg-purple-500">
        <AiOutlineSmile className="mr-5 text-myG text-4xl" />
        <FaPlus className="mr-2 text-gray-500" />
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleChange}
          className="w-full p-3 bg-white border-0 rounded-md focus:outline-none mx-6 text-lg"
        />
        {message.length === 0 ? (
          <FaMicrophone className="text-gray-600" />
        ) : (
          <FaPaperPlane
            className="mr-2 text-gray-500 cursor-pointer"
            onClick={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};

export default Chats;
