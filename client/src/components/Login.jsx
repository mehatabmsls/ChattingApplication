import React from "react";
import useStore from "../zustand/state";

function Login() {
  const handleClose = useStore((state) => state.handleClose);
  const Email = useStore((state) => state.Email);
  const handleEmail = useStore((state) => state.handleEmail);
  const handleSignIn = useStore((state) => state.handleSignIn);
  const handleLogIn = useStore((state) => state.handleLogIn);
  const handleLogInUser = useStore((state) => state.handleLogInUser);
  const LandingPageErrorMsg = useStore((state) => state.LandingPageErrorMsg);

  return (
    <>
      <div className="bottom_bar min-w-[40vw] min-h-[45vh] bg-[rgb(24,24,24)] rounded-t-lg flex-col border-b-[2px] border-[rgb(40,40,40)]">
        <section className="flex justify-center border-b-[2px] border-[rgb(40,40,40)] relative">
          <div className="font-Spline rounded-lg w-[50vw] flex py-3 justify-center items-center">
            Start Chatting ⚡
            <div
              onClick={handleSignIn}
              className="bg-black px-2 py-1 rounded-md ml-3  cursor-pointer"
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
          <div
            onClick={handleClose}
            className="absolute flex justify-center items-center mr-8 cursor-pointer right-0 top-4"
          >
            X
          </div>
        </section>
        <section>
          <div className="h-5 font-Spline_Mono text-red-500 p-2">
            {LandingPageErrorMsg}
          </div>
          <div className="flex justify-between items-center mb-8 px-40 mt-9">
            <label className="font-Spline_Mono" htmlFor="email">
              Email :
            </label>
            <input
              value={Email}
              onChange={(e) => handleEmail(e)}
              id="email"
              placeholder="Email"
              className="ml-2 block outline-none text-[wheat] bg-[rgb(36,36,36)] h-10 w-60 rounded-md px-2 placeholder:text-[rgb(70,70,70)]"
              type="text"
            ></input>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={() => handleLogInUser(Email)}
              className="bg-black px-2 py-1 rounded-md"
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;