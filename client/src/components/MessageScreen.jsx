import React from "react";
import useStore from "../zustand/state";
import { VscSend } from "react-icons/vsc";
import { BsEmojiSmile } from "react-icons/bs";

function MessageScreen({ handleSubmit, scrollToElement }) {
  const CurrentRoomID = useStore((state) => state.CurrentRoomID);
  const Email = useStore((state) => state.Email);
  const handleSendMessage = useStore((state) => state.handleSendMessage);
  const handleConversation = useStore((state) => state.handleConversation);
  const message = useStore((state) => state.message);
  function handleSubmitMsg() {
    handleSubmit();
    handleConversation(Email, CurrentRoomID, message);
    scrollToElement();
  }
  return (
    <div className="flex justify-center items-center px-12 pb-[23px] relative">
      <button
        className="absolute right-16 cursor-pointer"
        onClick={handleSubmitMsg}
      >
        <VscSend
          className="text-[rgb(132,132,132)] inline-block"
          size={24}
        ></VscSend>
      </button>
      <button
        className="absolute left-16 cursor-pointer"
        onClick={handleSubmitMsg}
      >
        <BsEmojiSmile
          className="text-[rgb(132,132,132)] inline-block"
          size={20}
        ></BsEmojiSmile>
      </button>

      <textarea
        value={message}
        onChange={(e) => handleSendMessage(e)}
        id="message"
        placeholder="Message"
        className="textarea resize-none flex-1 outline-none text-[bisque] bg-[rgb(36,36,36)] h-12 pt-3 rounded-full px-4 pl-12 pr-24 placeholder:text-[rgb(70,70,70)]"
        type="text"
      ></textarea>
    </div>
  );
}

export default MessageScreen;