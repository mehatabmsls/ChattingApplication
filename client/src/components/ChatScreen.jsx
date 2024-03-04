import React, { useEffect, useRef, useState } from "react";
import AddContact from "./AddContact";
import useStore from "../zustand/state";
import ChatMembers from "./ChatMembers";
import MessageScreen from "./MessageScreen";
import { AiOutlinePlus } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi";
import Modal from "react-modal";
import GroupScreen from "./GroupScreen";

function ChatScreen({ handleJoin, handleSubmit }) {
  const ContactList = useStore((state) => state.ContactList);
  const AddingContact = useStore((state) => state.AddingContact);
  const StartingScreen = useStore((state) => state.StartingScreen);
  const UserName = useStore((state) => state.UserName);
  const handleAddContact = useStore((state) => state.handleAddContact);
  const Conversation = useStore((state) => state.Conversation);
  const Email = useStore((state) => state.Email);
  const FullName = useStore((state) => state.FullName);
  const handleSettingsFalse = useStore((state) => state.handleSettingsFalse);
  const handleSettings = useStore((state) => state.handleSettings);
  const ShowSettings = useStore((state) => state.ShowSettings);
  const msgRef = useRef(null);
  const scrollToElement = () => {
    if (msgRef.current) {
      msgRef.current.scrollIntoView();
    }
  };
  useEffect(() => {
    document.getElementById("root").onclick = function (e) {
      if (
        e.target != document.getElementById("content") &&
        e.target != document.getElementById("content2") &&
        e.target != document.getElementById("content3") &&
        e.target != document.getElementById("content4") &&
        e.target != document.getElementById("content5")
      ) {
        handleSettingsFalse();
      } else {
      }
    };
  }, []);

  return (
    <>
      <div className="font-Spline h-auto dark:bg-[rgb(11,11,11)] dark:text-white flex">
        <div className="bg-[rgb(11,11,11)] h-[100vh] sticky top-0 min-w-[300px] border-r-2 border-[rgb(45,45,45)] flex flex-col overflow-auto gap-[2px]">
          {/* {true && <GroupScreen></GroupScreen>} */}
          {AddingContact ? (
            <AddContact></AddContact>
          ) : (
            <>
              {/* start */}
              <div className="bg-[rgb(24,24,24)] py-6 hover:bg-[rgb(34,34,34)] h-[60px] flex items-center gap-4 relative">
                <div className="h-[40px] w-[40px] rounded-full bg-black ml-3 cursor-pointer"></div>
                <section className="gap-24 relative flex items-center">
                  <div className="font-Spline text-left w-28 inline-flex">
                    {/* {item.FullName} */}
                    {FullName.replace(/^(.{16}[\^\\s]*).*/, "$1...")}
                  </div>
                  <div
                    onClick={handleSettings}
                    id="content4"
                    className="text-slate-300 justify-center items-center cursor-pointer"
                  >
                    <span>
                      <SlOptionsVertical id="content5"></SlOptionsVertical>
                    </span>
                  </div>
                  {ShowSettings && (
                    <div className="absolute right-0 top-8 bg-[rgb(36,36,36)] flex-co justify-start items-start rounded-md">
                      <div
                        id="content"
                        className=" hover:bg-slate-800 flex justify-start p-3 px-4 items-center gap-2 cursor-pointer"
                      >
                        <HiOutlineUserGroup size={21}></HiOutlineUserGroup>New
                        Group
                      </div>
                      <div
                        id="content2"
                        className="hover:bg-slate-800 p-3 px-4 flex justify-start items-center gap-2 cursor-pointer"
                      >
                        <IoSettingsOutline size={18}></IoSettingsOutline>
                        Settings
                      </div>
                      <div
                        id="content3"
                        className="hover:bg-slate-800 flex justify-start p-3 px-4 items-center gap-2 cursor-pointer"
                      >
                        <IoLogOutOutline size={21}></IoLogOutOutline>Logout
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* end */}
              {ContactList.length !== 0 ? (
                ContactList.map((item, index) => {
                  return (
                    <ChatMembers
                      key={index}
                      scrollToElement={scrollToElement}
                      item={item}
                      handleJoin={handleJoin}
                    ></ChatMembers>
                  );
                })
              ) : (
                <div className="font-Spline_Mono flex justify-center items-center italic p-4 text-gray-600">
                  Add Contacts
                </div>
              )}
            </>
          )}

          {AddingContact ? (
            ""
          ) : (
            <div
              onClick={handleAddContact}
              className="flex justify-center items-center absolute bottom-6 rounded-full left-56 bg-[rgb(36,36,36)] min-w-[45px] min-h-[45px] cursor-pointer"
            >
              <button className="px-2 py-1 rounded-md flex justify-center items-center">
                <AiOutlinePlus
                  size={24}
                  className="text-green-300"
                ></AiOutlinePlus>
              </button>
            </div>
          )}
        </div>
        <section className="">
          {!StartingScreen && (
            <section className="sticky top-0">
              <div className="px-4 element flex items-center font-Spline bg-[rgb(24,24,24)] py-2 sticky h-[60px]">
                <div className="h-10 w-10 rounded-full bg-[rgb(0,0,0)]"></div>
                <div className="px-2 py-2 text-xl">{UserName}</div>
              </div>
            </section>
          )}
          {Conversation.length !== 0 && (
            <div className="inline-flex px-12 break-all element flex-col gap-2 mb-20 pt-10 pb-10">
              {Conversation.map((item, index) => {
                if (item.sender === Email) {
                  return (
                    <div key={index} className="flex justify-end items-center">
                      <div className="mx-[23px] max-w-[500px] bg-green-800 text-[#ffffff] rounded-xl py-1 inline-flex justify-end px-2 items-center">
                        {item.message}
                        <span className="text-[10px] text-gray-300 ml-2 mt-2">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex justify-start items-center"
                    >
                      <div className="mx-[23px] max-w-[500px] bg-[rgb(36,36,36)] text-[#ffffff] rounded-xl py-1 inline-flex justify-start px-2 items-center">
                        {item.message}
                        <span className="text-[10px] text-gray-300 ml-2 mt-2">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                }
              })}
              <div ref={msgRef}></div>
            </div>
          )}
        </section>

        {StartingScreen && (
          <div className="flex justify-center items-center h-[100vh] element text-gray-400">
            Click on the Chats to Start Chatting
          </div>
        )}
        <div className="bg-[rgb(11,11,11)] fixed element left-[300px] bottom-[0px]">
          {!StartingScreen && (
            <MessageScreen
              scrollToElement={scrollToElement}
              handleSubmit={handleSubmit}
            ></MessageScreen>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatScreen;