import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatScreen from "./ChatScreen";
import axios from "axios";
import useStore from "../zustand/state";

function Home() {
  const Email = useStore((state) => state.Email);
  const FullName = useStore((state) => state.FullName);
  const handleContactList = useStore((state) => state.handleContactList);
  const socketRef = useRef();
  const setFullName = useStore((state) => state.setFullName);
  const handleConversation = useStore((state) => state.handleConversation);
  const StartingScreen = useStore((state) => state.StartingScreen);
  const [data, setData] = useState();
  const message = useStore((state) => state.message);
  const CurrentRoomID = useStore((state) => state.CurrentRoomID);
  const setCurrentRoomID = useStore((state) => state.setCurrentRoomID);
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("connect", () => {
      console.log("Connected to socket.IO");
    });
    socketRef.current.on("received", (data) => {
      setData(data);
      console.log(data);
    });
    handleJoin(Email);
    axios
      .post("http://localhost:5000/get_contacts", {
        Email: Email,
      })
      .then((response) => {
        console.log(response.data.contacts);
        if (FullName == "") {
          setFullName(response.data.name);
        }
        handleContactList(response.data.contacts);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {
      socketRef.current.disconnect();
      console.log("Disconnected from socket.IO");
    };
  }, []);
  //update convers receiver
  useEffect(() => {
    if (StartingScreen !== true) {
      console.log(CurrentRoomID, data.sender);
      if (CurrentRoomID == data.sender) {
        handleConversation(data.sender, data.receiver, data.message);
      }
    }
  }, [data]);
  //imp
  function handleJoin(ID) {
    setCurrentRoomID(ID);
    socketRef.current.emit("joinRoom", {
      roomID: ID,
    });
  }
  function handleSubmit() {
    const event = new Date();
    if (message !== "") {
      socketRef.current.emit("sendMessage", {
        name: FullName,
        sender: Email,
        receiver: CurrentRoomID,
        message: message,
        time: event.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
        }),
      });
      console.log("message sent");
    }
  }
  return (
    <div className="font-Spline text-red-500 dark:bg-purple-500">
      {/* <section>
        <div
          onClick={() => {
            document.documentElement.classList.add("dark");
          }}
        >
          DarkMode
        </div>
        <div
          onClick={() => {
            document.documentElement.classList.remove("dark");
          }}
        >
          LightMode
        </div>
      </section> */}
      <ChatScreen
        handleJoin={handleJoin}
        handleSubmit={handleSubmit}
      ></ChatScreen>
    </div>
  );
}

export default Home;