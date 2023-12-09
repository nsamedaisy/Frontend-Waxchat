import React, { useState, ChangeEvent, useEffect } from "react";

import { useDropzone } from "react-dropzone";
import {
    FaPlus,
    FaTimes,
    FaPaperPlane,
    FaFile,
  } from "react-icons/fa";
  import { AiOutlineSmile } from "react-icons/ai";


function SelectFile() {

  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

    const handleFileDrop = (acceptedFiles: File[]) => {
      // Handle file upload logic here
      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        ...acceptedFiles,
      ]);
    };
  
    const handleRemoveFile = (fileIndex: number) => {
      setUploadedFiles((prevUploadedFiles) =>
        prevUploadedFiles.filter((_, index) => index !== fileIndex)
      );
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      // accept: ["application/pdf", "image/*", "video/*"],
      multiple: true,
      onDrop: handleFileDrop,
    });
  
    const handleDocumentClick = () => {
      const input = document.getElementById("fileInput");
      if (input) {
        input.click();
      }
    };
  
    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        handleFileDrop(Array.from(files));
      }
    };
  return (
    <div>
        <div
    className="dropzone bg-red-600 z-30 h-[calc(100vh-117px)] bigScreen:h-[calc(100vh-117px-39px)] px-4 space-y-10"
  >
    <div className="h-14 bg-gray-600 w-full flex items-center p-4">
      <FaTimes
        className="text-gray-800 text-2xl cursor-pointer"
        // onClick={handlePlusIconClick}
      />{" "}
      {/* <p>{{file.name}}</p> */}
    </div>
    <div>
      <p>No preview available</p>
    </div>

    <div className="flex bg-white rounded-md py-2 pl-4 w-[75%] m-auto">
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={handleChange}
        className="w-full bg-transparent text-sm border-0 focus:outline-none"
      />
      <AiOutlineSmile className="mr-5 text-myG text-4xl" />
    </div>
    <p className=" border-b border-gray-500"></p>

    <div className="flex space-x-4 justify-center">
      {uploadedFiles.map((file, index) => (
        <div
          key={index}
          className="border flex-col p-4 w-16 h-16 hover:bg-gray-500"
        >
          <button
            onClick={() => handleRemoveFile(index)}
            className="text-sm"
          >
            <FaTimes />
          </button>

          <FaFile className="text-5xl" />
        </div>
      ))}

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <p className="border p-4 w-16 h-16 hover:bg-gray-500">
            <FaPlus className="cursor-pointer " />
          </p>
        )}
      </div>
      <div>
        <FaPaperPlane  className="text-5xl bg-themecolor p-4 rounded-full text-white"/>
      </div>
    </div>

  </div>
  </div>
  )
}

export default SelectFile