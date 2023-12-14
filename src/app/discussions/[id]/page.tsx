"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Avatar from "@/components/atoms/Avatar";
import {
  FaSearch,
  FaEllipsisV,
  FaPlus,
  FaMicrophone,
  FaTimes,
  FaFileInvoice,
  FaPhotoVideo,
  FaUser,
  FaCamera,
  FaPaperPlane,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { AiOutlineSmile } from "react-icons/ai";
import { socket } from "@/utils/services";

// const socket = io();
// import { revalidateData } from "@/utils/services";
import ContactInfo from "@/components/organisms/ContactInfo";
import DropdownModal from "@/components/atoms/DropdownModal";
import Messages from "@/components/organisms/Messages/Messages";
import { IoMdArrowBack } from "react-icons/io";
import Pulsation from "@/components/molecules/Pulsation";
import { useAppContext } from "@/app/Context/AppContext";

// export const revalidate = 0;
const Chats = () => {
  const param = useParams();
  const router = useRouter();
  const [showInfoCard, setShowInfoCard] = useState(false);

  const [message, setMessage] = useState<string>("");
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [connected, setConnected] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUser } = useAppContext();
  const [disconnectedUser, setDisconnectedUser] = useState<string>("");

  const [receiver, setReceiver] = useState<Room | null>((): Room | null => {
    if (typeof localStorage !== "undefined") {
      const fromLocalStorage =
        JSON.parse(localStorage.getItem("receiver") as string) || {};
      if (fromLocalStorage) return fromLocalStorage;
    }
    return null;
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const divMessageRef = useRef<HTMLDivElement | null>(null);

  let oldReceiver: string = "";

  socket.on("message", (data) => {
    // console.log("message received: ", data);
    if (Array.isArray(data)) {
      setReceivedMessages([...receivedMessages, ...data]);
    } else setReceivedMessages([...receivedMessages, data]);
  });

  socket.on("connect_error", (err) => {
    console.log(`connection error due to ${err}`);
    setConnected("");
  });

  socket.on("disconnected", (data) => {
    console.log(data);
    socket.disconnect();
    setConnected("");
    setTypingStatus("");
    setDisconnectedUser(data);
  });

  useEffect(() => {
    socket.emit("connected", {
      room: param.id,
      owner: currentUser?.id,
    });
    setReceivedMessages([]);

    setReceiver(() => JSON.parse(localStorage.getItem("receiver") || "{}"));
    const data = {
      sender_id: currentUser?.id,
      receiver_room_id: param.id,
    };

    socket.emit("roomMessages", data);
  }, [param.id, currentUser?.name, currentUser?.id]);

  useEffect(() => {
    if (divMessageRef && divMessageRef.current) {
      divMessageRef.current.scrollTo(0, divMessageRef.current.scrollHeight);
    }
    socket.on("updateMessage", (data) => {
      console.log("update message", data);
      const index = receivedMessages?.findIndex(
        (msg: Message) => msg.id === data.id
      );
      if (index !== -1) {
        receivedMessages[index].reaction = data.reaction;
        setReceivedMessages(receivedMessages);
      }
    });
  }, [receivedMessages]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // Handle sending message logic here

    const messageObject: Partial<Message> = {
      content: message,
      sender_id: currentUser?.id as string,
      receiver_room_id: param.id as string,
      sender_name: currentUser?.name,
      sender_phone: currentUser?.phone,
      reaction: "",
      is_read: false,
    };

    socket.emit("sendMessage", messageObject);
    setMessage("");
  };

  const handleAvatarClick = () => {
    setShowInfoCard(!showInfoCard);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setTypingStatus("");
      handleSendMessage();
    }
    console.log(typingStatus);
    socket.emit("typing", {
      room: param.id,
      owner: currentUser?.id,
    });
  };

  socket.on("typingResponse", (data) => {
    console.log(data);
    setTypingStatus(data);
  });

  const handlePlusIconClick = () => {
    setShowDropdown((prevState) => !prevState);
  };

  function handleBlur(e: any) {
    if (!e.target.value) setTypingStatus("");
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        !(event.target as HTMLElement)?.closest(".dropdown-content")
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);
  // setTimeout(async () => {
  //   console.log("timing");
  //   const data = await revalidateData(currentUser.id);
  //   const intermediate = data;
  //   console.log(data);
  //   setReceivedMessages(intermediate);
  // }, 100);
  // console.log(receivedMessages);
  socket.on("notify", (data) => {
    console.log(data);
    setConnected(data);
  });

  return (
    <>
      <div className="w-full flex justify-between">
        <div
          className={`relative flex flex-col h-full w-full mobile:max-sm:${
            showInfoCard ? "hidden" : "visible"
          }`}
        >
          <div className="flex items-center justify-between p-2  bg-chatGray border-l-2 w-full">
            <div className="flex items-center hover:cursor-ponter">
              <>
                <button
                  onClick={() => router.push("/discussions")}
                  className="sm:hidden mr-3 relative "
                >
                  <IoMdArrowBack size={200} />
                </button>
                <Avatar
                  size={4}
                  onClick={handleAvatarClick}
                  profilePicture={
                    receiver?.image ||
                    "https://i.pinimg.com/564x/a7/da/a4/a7daa4792ad9e6dc5174069137f210df.jpg"
                  }
                />
              </>

              <div className="ml-4 flex flex-col justify-center items-start ">
                <p className="text-md">{receiver?.name}</p>
                <span className="text-gray-500 text-xs">
                  {connected
                    ? connected
                    : disconnectedUser
                    ? disconnectedUser
                    : ""}
                </span>
                <span className="text-xs">
                  {typingStatus ? typingStatus : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-xl">
              <FaSearch className="mr-8" />
              <FaEllipsisV
                onClick={handleAvatarClick}
                className="mr-2 hover:cursor-pointer"
              />
            </div>
          </div>

          <div
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            }}
            className="w-full h-[calc(100vh-117px)] bigScreen:h-[calc(100vh-117px-39px)] overflow-y-auto p-4 overflow-x-clip "
            ref={divMessageRef}
          >
            <Messages
              messageList={receivedMessages}
              currentUser={currentUser as Room}
              receiver={receiver as Room}
            />
          </div>

          <div
            onSubmit={handleSendMessage}
            className="flex items-center justify-between p-3 text-2xl text-gray-500  bg-chatGray"
            style={{ transition: "none" }}
          >
            <AiOutlineSmile className="mr-5 text-myG text-4xl" />
            {showDropdown ? (
              <FaTimes
                className="text-gray-500 cursor-pointer bg-gray-200 p-2 text-4xl rounded-full "
                onClick={handlePlusIconClick}
              />
            ) : (
              <FaPlus
                className="text-gray-500 cursor-pointer"
                onClick={handlePlusIconClick}
              />
            )}
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={handleChange}
              className="w-full p-2 bg-white text-sm border-0 rounded-md focus:outline-none mx-6 "
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              ref={(node) => {
                if (node) {
                  if (!node.value) {
                    setTypingStatus("");
                  }
                }
              }}
            />
            {message.length === 0 ? (
              <button>
                <FaMicrophone className="text-gray-600 mr-4" />
              </button>
            ) : (
              <button>
                <FaPaperPlane
                  className="mr-4 text-gray-500 cursor-pointer"
                  onClick={handleSendMessage}
                />
              </button>
            )}
          </div>
        </div>

        {showInfoCard && (
          <ContactInfo
            id={""}
            title={`${receiver?.isGroup ? "Group info" : "Contact info"}  `}
            onClose={() => setShowInfoCard((prev) => !prev)}
            picture={
              receiver?.image ||
              "https://i.pinimg.com/564x/fe/85/c3/fe85c35b97c3f14082ac2edfb25eba44.jpg"
            }
            name={receiver?.name as string}
            about={"made of gold"}
            email={receiver?.email as string}
          />
        )}
      </div>

      {showDropdown && (
        <DropdownModal onClose={() => setShowDropdown(false)}>
          <div className="p-5 pr-10 rounded-xl bg-white absolute bottom-16 left-[34%] transform -translate-x-1/2 shadow-lg">
            <div className="flex items-center space-x-3 text-lg cursor-pointer">
              <FaFileInvoice className="text-purple-500 text-2xl" />
              <span className="text-gray-600">Document</span>
            </div>
            <div className="flex items-center py-5 space-x-3 text-lg cursor-pointer">
              <FaPhotoVideo className="text-blue-600 text-2xl" />
              <span className="text-gray-600">Photos & Videos</span>
            </div>
            <div className="flex items-center space-x-3 text-lg cursor-pointer">
              <FaCamera className="text-pink-600  text-2xl" />
              <span className="text-gray-600">Camera</span>
            </div>
            <div className="flex items-center pt-5 space-x-3 text-lg cursor-pointer">
              <FaUser className="text-blue-400 text-2xl" />
              <span className="text-gray-600">Contact</span>
            </div>
          </div>
        </DropdownModal>
      )}
    </>
  );
};

export default Chats;
