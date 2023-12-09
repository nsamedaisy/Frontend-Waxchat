"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import { useDropzone } from "react-dropzone";
import { FaPlus, FaTimes, FaPaperPlane, FaFile } from "react-icons/fa";
import { AiOutlineSmile } from "react-icons/ai";

interface SelectFileProps {
  file: File | string;
  onCaptureImage: (image: string) => void;
}

const SelectFile: React.FC<SelectFileProps> = ({ file, onCaptureImage }) => {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleCaptureImage = () => {
    const capturedImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...";
    onCaptureImage(capturedImage);
  };

  const handleClear = () => {
    router.back();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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

  return (
    <div className="dropzone bg-chatGray z-30 h-[89vh] w-[65%] right-12 top-16 fixed">
      <div className="h-16 bg-gray-200 flex items-center p-4">
        <FaTimes
          className="text-gray-500 text-3xl cursor-pointer mr-96"
          onClick={handleClear}
        />{" "}
        <p>{typeof file === "string" ? "Captured Image" : file.name}</p>
      </div>


      <div className="flex justify-center items-center flex-col my-20">
  {file && typeof file === "string" ? (
    <div>
      <h3>Preview:</h3>
      <img src={file} alt="Captured" />
    </div>
  ) : file ? (
    <div>
      <h3>Preview:</h3>
      <img src={URL.createObjectURL(file as Blob)} alt="Uploaded" />
    </div>
  ) : (
    <div className="hidden">
      <h3>Preview:</h3>
      <img src="" alt="" />
    </div>
  )}
  {!file && typeof file !== "string" && (
    <FaFile className="text-9xl mb-6 text-white" />
  )}
  {!file && (
    <p className="text-2xl text-gray-400">No preview available</p>
  )}
  {!file && (
    <p className="text-base text-gray-400">194 MB - DMG</p>
  )}
</div>


      <div className="flex bg-white rounded-md py-2 pl-4 w-[75%] m-auto">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={handleChange}
          className="w-full bg-transparent text-lg border-0 focus:outline-none"
        />
        <AiOutlineSmile className="mr-5 text-myG text-4xl" />
      </div>
      <p className=" border-b border-gray-300 my-6"></p>

      <div className="flex space-x-4 justify-center">
        {uploadedFiles.map((_, index) => (
          <div
            key={index}
            className="border-4 border-themecolor flex-col p-8 w-16 h-16 relative cursor-pointer rounded-md bg-white hover:bg-gray-300 "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => handleRemoveFile(index)}
              className="text-lg text-white absolute top-0 right-0 p-1"
            >
              {isHovered && <FaTimes />}
            </button>

            <FaFile className="text-4xl text-myG absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))}

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div className="border-2 p-4 w-16 h-16 flex items-center justify-center rounded-md mr-96">
              <FaPlus className="cursor-pointer text-2xl text-myG" />
            </div>
          )}
          {/* {isHovered && <span className=" bg-gray-300 text-sm px-2 py-1">Add file</span>} */}
        </div>

        <div className="bg-themecolor rounded-full w-16 h-16 cursor-pointer flex items-center justify-center">
          <FaPaperPlane className="text-3xl text-white" />
        </div>
      </div>
    </div>
  );
};

export default SelectFile;
