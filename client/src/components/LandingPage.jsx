import React from "react";
import useStore from "../zustand/state";
import Login from "./Login";
import Register from "./Register";
import EmailVerification from "./EmailVerification";

function LandingPage() {
  const ShowPage = useStore((state) => state.ShowPage);
  const handleSignIn = useStore((state) => state.handleSignIn);
  const handleLogIn = useStore((state) => state.handleLogIn);
  const ShowVerification = useStore((state) => state.ShowVerification);
  return (
    <div className="font-Spline bg-black">
      <div className=" text-[bisque] flex justify-center">
        <div className="flex justify-center items-center absolute bottom-0">
          {ShowPage === "SignUp" ? (
            <>
              {ShowVerification ? (
                <EmailVerification></EmailVerification>
              ) : (
                <Register></Register>
              )}
            </>
          ) : (
            <>
              {ShowPage === "LogIn" ? (
                <Login></Login>
              ) : (
                <div className="bottom_bar min-w-[50vw] hover:min-h-[14vh] bg-[rgb(24,24,24)] rounded-t-lg flex-col border-b-[2px] border-[rgb(40,40,40)]">
                  <section className="transition-all delay-300 ease-in-out duration-300 flex justify-center border-b-[2px] border-[rgb(40,40,40)]">
                    <div className=" font-Spline rounded-lg w-[50vw] flex py-3 justify-center items-center">
                      Start Chatting ⚡
                      <div
                        onClick={handleSignIn}
                        className="bg-black px-2 py-1 rounded-md ml-3 cursor-pointer"
                      >
                        Sign Up
                      </div>
                      <div
                        onClick={handleLogIn}
                        className="bg-black px-2 py-1 rounded-md ml-3 cursor-pointer"
                      >
                        Log In
                      </div>
                    </div>
                    {/* <div
                      onClick={handleSignIn}
                      className="flex justify-center items-center mr-8 cursor-pointer"
                    >
                      ❤️
                    </div> */}
                  </section>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;