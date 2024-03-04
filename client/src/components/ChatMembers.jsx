import React, { useEffect } from "react";
import useStore from "../zustand/state";

function ChatMembers({ handleJoin, item, scrollToElement }) {
  const handleSetConvers = useStore((state) => state.handleSetConvers);
  const Conversation = useStore((state) => state.Conversation);
  useEffect(() => {
    scrollToElement();
  }, [Conversation]);
  function handleJoinRoom() {
    handleJoin(item.Email);
    handleSetConvers(item.FullName, item.Email);
  }
  return (
    <div
      onClick={handleJoinRoom}
      className="bg-[rgb(24,24,24)] py-9 hover:bg-[rgb(34,34,34)] active:bg-[rgb(40,40,40)] h-[60px] flex items-center gap-4 cursor-pointer"
    >
      <div className="h-[55px] w-[55px] rounded-full bg-black ml-3"></div>
      <section>
        <div className="font-Spline text-left">{item.FullName}</div>
        <div className="text-slate-500 flex text-left">Last Message</div>
      </section>
    </div>
  );
}

export default ChatMembers;