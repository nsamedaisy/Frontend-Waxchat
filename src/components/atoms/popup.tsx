import React from "react";
import Button from "./button";

type Props = {
  isOpen: boolean;
  onClose: any;
  title: string;
  content: string;
  label: string;
  onClick?: () => void;
};

const Popup = ({ isOpen, onClose, title, content, label, onClick }: Props) => {
  const handleOnclose = (e: any) => {
    if (e.target.id === "container") onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="container"
      onClick={handleOnclose}
      className="fixed z-10 inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex justify-center items-center shadow-2xl"
    >
      <div className="relative w-[500px] h-[50vh] bg-white p-8 rounded ">
        <h1 className="text-[22px] text-gray-600">{title}</h1>
        <div className="flex gap-3">{content}</div>
        <hr className="text-gray-400" />
        <div className="absolute bottom-8 right-6 flex gap-4">
          <Button label={label} />
          <Button label={label} />
        </div>
      </div>
    </div>
  );
};

export default Popup;
