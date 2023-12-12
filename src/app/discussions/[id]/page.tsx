"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";

import { uploadFileToSupabase } from "@/utils/service/queries"

import { useDropzone } from "react-dropzone";
import Webcam from "react-webcam";

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
  FaVideo,
  FaCameraRetro,
  FaCamera,
  FaPaperPlane,
} from "react-icons/fa";
import { AiOutlineSmile } from "react-icons/ai";

import ContactInfo from "@/components/organisms/ContactInfo";
import DropdownModal from "@/components/atoms/DropdownModal";
import SelectFile from "@/components/organisms/SelectFile";

const Chats = () => {
  const [message, setMessage] = useState("");
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | string | null>(null);

  const [captureMode, setCaptureMode] = useState<"photo" | "video">("photo");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);

  const handleCaptureImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot() || null;
    setSelectedFile(imageSrc);
    setIsCameraOpen(false);
  };

  const handleCaptureVideo = () => {
    if (isRecording) {
      setIsRecording(false);
      // Logic to stop video recording
    } else {
      setIsRecording(true);
      // Logic to start video recording
    }
  };

  const handleFileSelect = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
  
      try {
        const fileUrl = await uploadFileToSupabase(file);
        if (fileUrl) {
          console.log('File uploaded successfully:', fileUrl.data.publicUrl);
          setSelectedFile(fileUrl.data.publicUrl);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFileSelect,
    multiple: false,
    // accept: "application/pdf",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle sending message logic here
    alert(`sending ${message}`);
  };

  const handleAvatarClick = () => {
    setShowInfoCard(!showInfoCard);
  };

  const handlePlusIconClick = () => {
    setShowDropdown((prevState) => !prevState);
    setCaptureMode("photo");
    setIsCameraOpen(false);
  };

  const handleCloseSelectFile = () => {
    setSelectedFile(null);
  };

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

  return (
    <>
      <div className="w-full flex justify-between">
        <div
          className={`relative flex flex-col h-full w-full mobile:max-sm:${
            showInfoCard ? "hidden" : "visible"
          }`}
        >
          <div className="flex items-center justify-between p-2  bg-chatGray border-l-2 w-full">
            <div className="flex items-center">
              <Avatar
                size={4}
                profilePicture="https://i.pinimg.com/564x/17/f7/ba/17f7baaff77ee55d8807fcd7b2d2f47a.jpg"
                onClick={handleAvatarClick}
              />
              <div className="ml-4 ">
                <p className="text-md">John Doe</p>
                {/* <span className="text-gray-500 text-xs">online/offline</span> */}
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-xl">
              <FaSearch className="mr-8" />
              <FaEllipsisV className="mr-2" />
            </div>
          </div>
          {/* ######## ALL MESSAGES SHOULD BE DISPLAYED IN THIS DIV BELLOW ########## */}
          <div
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')",
            }}
            className="w-full h-[calc(100vh-117px)] bigScreen:h-[calc(100vh-117px-39px)] overflow-x-scroll p-4"
          >
            {selectedFile && (
              <SelectFile
                file={selectedFile}
                onCaptureImage={handleCaptureImage}
                onClose={handleCloseSelectFile}
              />
            )}
          </div>
          {/* ######## ALL MESSAGES SHOULD BE DISPLAYED IN THIS DIV ABOVE ########## */}

          <form
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
              className="w-full p-2 bg-white text-sm border-0 rounded-md focus:outline-none mx-6"
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
          </form>
        </div>

        {showInfoCard && (
          <ContactInfo
            id={""}
            title={"Contact info"}
            onClose={() => setShowInfoCard((prev) => !prev)}
            picture={
              "https://i.pinimg.com/564x/fe/85/c3/fe85c35b97c3f14082ac2edfb25eba44.jpg"
            }
            name={"Caleb matins"}
            about={"made of gold"}
            email={"calebmatins@gmail.com"}
          />
        )}
      </div>

      {showDropdown && (
        <DropdownModal onClose={() => setShowDropdown(false)}>
          <div className="p-5 pr-10 rounded-xl bg-white absolute bottom-16 left-[41%] transform -translate-x-1/2 shadow-lg">
            <div
              {...getRootProps()}
              className="dropzone flex items-center space-x-3 text-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              <FaFileInvoice className="text-purple-500 text-2xl" />
              <span className="text-gray-600">Document</span>
            </div>

            <div
              {...getRootProps()}
              className="flex items-center py-5 space-x-3 text-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              <FaPhotoVideo className="text-blue-600 text-2xl" />
              <span className="text-gray-600">Photos & Videos</span>
            </div>

            <div
              className="flex items-center space-x-3 text-lg cursor-pointer"
              onClick={() => setIsCameraOpen(true)}
            >
              <FaCamera className="text-pink-600 text-2xl" />
              <span className="text-gray-600">Camera</span>
            </div>

            <div className="flex items-center pt-5 space-x-3 text-lg cursor-pointer">
              <FaUser className="text-blue-400 text-2xl" />
              <span className="text-gray-600">Contact</span>
            </div>
          </div>
        </DropdownModal>
      )}

      {isCameraOpen && (
        <div className="">
          <FaTimes
            onClick={() => setIsCameraOpen(false)}
            className="absolute bottom-[79%] bg-themecolor left-1/3 text-2xl z-40 text-white cursor-pointer"
          />

          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <Webcam
              audio={captureMode === "video"}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg"
            />
            <button
              onClick={
                captureMode === "photo"
                  ? handleCaptureImage
                  : handleCaptureVideo
              }
              className="absolute bottom-36 left-1/2 transform -translate-x-1/2 mb-8 p-5 bg-themecolor text-gray-800 rounded-full shadow-md"
            >
              {captureMode === "photo" ? (
                <FaCameraRetro className="text-2xl font-extrabold text-white" />
              ) : (
                <FaVideo className="text-2xl font-extrabold text-white" />
              )}
            </button>
            {isCameraOpen && (
              <div className="absolute bottom-28 font-bold left-1/2 transform space-x-10 -translate-x-1/2">
                <button
                  className={`${
                    captureMode === "photo" ? "text-yellow" : "text-gray-500"
                  }`}
                  onClick={() => setCaptureMode("photo")}
                >
                  Photo
                </button>
                <button
                  className={`${
                    captureMode === "video" ? "text-white" : "text-gray-500"
                  }`}
                  onClick={() => setCaptureMode("video")}
                >
                  Video
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
