import React from "react";
import useStore from "../zustand/state";

function AddContact() {
  const handleAddContact = useStore((state) => state.handleAddContact);
  const handleContEmail = useStore((state) => state.handleContEmail);
  const handleContFullName = useStore((state) => state.handleContFullName);
  const addContEmail = useStore((state) => state.addContEmail);
  const addContFullName = useStore((state) => state.addContFullName);
  const handleNewContact = useStore((state) => state.handleNewContact);
  const ContactErrormsg = useStore((state) => state.ContactErrormsg);
  return (
    <div className="flex-col justify-center items-center mt-2">
      <div
        onClick={handleAddContact}
        className="min-w-[280px] flex items-end justify-end pr-2 mb-1 "
      >
        <span className="cursor-pointer">X</span>
      </div>
      {/* <div className="flex justify-center items-center mb-4">AddContact</div> */}
      <div className="flex justify-center items-center mb-4">
        <input
          value={addContFullName}
          onChange={(e) => handleContFullName(e)}
          id="contFullName"
          placeholder="Full Name"
          className=" block outline-none text-[wheat] bg-[rgb(36,36,36)] h-10 w-60 rounded-md px-2 placeholder:text-[rgb(70,70,70)]"
          type="text"
        ></input>
      </div>
      <div className="flex justify-center items-center mb-4">
        <input
          value={addContEmail}
          onChange={(e) => handleContEmail(e)}
          id="contEmail"
          placeholder="Email"
          className=" block outline-none text-[wheat] bg-[rgb(36,36,36)] h-10 w-60 rounded-md px-2 placeholder:text-[rgb(70,70,70)]"
          type="text"
        ></input>
      </div>
      <div className="flex justify-center items-center">
        <button
          onClick={handleNewContact}
          className="bg-black px-2 py-1 rounded-md"
        >
          Add Contact
        </button>
      </div>
      <div className="flex justify-center items-center mt-6 text-red-400">
        {ContactErrormsg}
      </div>
    </div>
  );
}

export default AddContact;