import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import validator from "validator";

const useStore = create(
  immer((set, get) => ({
    ShowPage: "",
    FullName: "",
    ShowVerification: false,
    Email: "",
    LandingPageErrorMsg: "",
    Conversation: [],
    LoggedIn: false,
    ShowSettings: false,
    VerificationCode: "",
    ContactList: [],
    AddingContact: false,
    UserName: "",
    StartingScreen: true,
    CurrentRoomID: "",
    addContEmail: "",
    message: "",
    addContFullName: "",
    ContactErrormsg: "",
    //functions
    handleSignIn: () => {
      set((state) => {
        state.ShowPage = "SignUp";
      });
    },
    handleLogIn: () => {
      set((state) => {
        state.ShowPage = "LogIn";
      });
    },
    handleClose: () => {
      set((state) => {
        state.ShowPage = "";
      });
      set((state) => {
        state.Email = "";
      });
      set((state) => {
        state.FullName = "";
      });
    },
    handleFullName: (e) => {
      set((state) => {
        state.FullName = e.target.value;
      });
    },
    handleEmail: (e) => {
      set((state) => {
        state.Email = e.target.value;
      });
    },
    handleSignInUser: (FullName, Email) => {
      if (FullName !== "" && Email !== "") {
        if (validator.isEmail(Email)) {
          set((state) => {
            state.LandingPageErrorMsg = "Processing...";
          });
          axios
            .post("http://localhost:5000/handleSignIn", {
              FullName: FullName,
              Email: Email,
            })
            .then((response) => {
              if (response.data.response === "Email Exists") {
                set((state) => {
                  state.LandingPageErrorMsg =
                    "Email already exists.Try Logging In";
                });
                setTimeout(() => {
                  set((state) => {
                    state.LandingPageErrorMsg = "";
                  });
                }, 3000);
              } else {
                set((state) => {
                  state.LandingPageErrorMsg = "";
                });
                set((state) => {
                  state.ShowVerification = true;
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          set((state) => {
            state.LandingPageErrorMsg = "Invalid Email";
          });
          setTimeout(() => {
            set((state) => {
              state.LandingPageErrorMsg = "";
            });
          }, 3000);
        }
      } else {
        set((state) => {
          state.LandingPageErrorMsg = "Please Enter FullName & Email";
        });
        setTimeout(() => {
          set((state) => {
            state.LandingPageErrorMsg = "";
          });
        }, 3000);
      }
    },
    handleLogInUser: (Email) => {
      if (Email !== "") {
        if (validator.isEmail(Email)) {
          axios
            .post("http://localhost:5000/handleLogIn", {
              Email: Email,
            })
            .then((response) => {
              if (response.data.message == "found") {
                set((state) => {
                  state.LoggedIn = true;
                });
              } else {
                set((state) => {
                  state.LandingPageErrorMsg = "User not found";
                });
                setTimeout(() => {
                  set((state) => {
                    state.LandingPageErrorMsg = "";
                  });
                }, 3000);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          set((state) => {
            state.LandingPageErrorMsg = "Invalid Email";
          });
          setTimeout(() => {
            set((state) => {
              state.LandingPageErrorMsg = "";
            });
          }, 3000);
        }
      } else {
        set((state) => {
          state.LandingPageErrorMsg = "Please Enter Email";
        });
        setTimeout(() => {
          set((state) => {
            state.LandingPageErrorMsg = "";
          });
        }, 3000);
      }
    },
    handleVerifyCode: (e) => {
      set((state) => {
        state.VerificationCode = e.target.value;
      });
    },
    handleVerifyUser: (VerificationCode) => {
      if (VerificationCode !== "") {
        axios
          .post("http://localhost:5000/handleOPTVerification", {
            Email: get().Email,
            VerificationCode: VerificationCode,
          })
          .then((response) => {
            if (response.data.response === "matched") {
              set((state) => {
                state.LoggedIn = true;
              });
            } else {
              set((state) => {
                state.LandingPageErrorMsg = "Invalid Code";
              });
              setTimeout(() => {
                set((state) => {
                  state.LandingPageErrorMsg = "";
                });
              }, 3000);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    handleContactList: (data) => {
      set((state) => {
        state.ContactList = data;
      });
    },
    handleAddContact: () => {
      set((state) => {
        state.AddingContact = !get().AddingContact;
      });
      set((state) => {
        state.addContFullName = "";
      });
      set((state) => {
        state.addContEmail = "";
      });
    },
    handleContEmail: (e) => {
      set((state) => {
        state.addContEmail = e.target.value;
      });
    },
    handleContFullName: (e) => {
      set((state) => {
        state.addContFullName = e.target.value;
      });
    },
    handleNewContact: () => {
      if (get().addContEmail !== "" && get().addContFullName !== "") {
        if (validator.isEmail(get().addContEmail)) {
          const hasEmail = get().ContactList.some(
            (user) => user.Email === get().addContEmail
          );
          if (!hasEmail) {
            axios
              .post("http://localhost:5000/handleNewContact", {
                Email: get().Email,
                FullName: get().addContFullName,
                Contact: get().addContEmail,
              })
              .then((response) => {
                if (response.data.message === "not found") {
                  set((state) => {
                    state.ContactErrormsg =
                      "This Email is Not Registered With Us.";
                  });
                  setTimeout(() => {
                    set((state) => {
                      state.ContactErrormsg = "";
                    });
                  }, 3000);
                } else {
                  set((state) => {
                    state.ContactList = response.data.contacts;
                  });
                  set((state) => {
                    state.AddingContact = !get().AddingContact;
                  });
                  set((state) => {
                    state.addContFullName = "";
                  });
                  set((state) => {
                    state.addContEmail = "";
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            set((state) => {
              state.ContactErrormsg = "User already Exists.";
            });
            setTimeout(() => {
              set((state) => {
                state.ContactErrormsg = "";
              });
            }, 3000);
          }
        } else {
          set((state) => {
            state.ContactErrormsg = "Invalid Email";
          });
          setTimeout(() => {
            set((state) => {
              state.ContactErrormsg = "";
            });
          }, 3000);
        }
      } else {
        set((state) => {
          state.ContactErrormsg = "Please Enter FullName & Email";
        });
        setTimeout(() => {
          set((state) => {
            state.ContactErrormsg = "";
          });
        }, 3000);
      }
    },
    setCurrentRoomID: (roomID) => {
      set((state) => {
        state.CurrentRoomID = roomID;
      });
    },
    handleSetConvers: (userName, chatEmail) => {
      set((state) => {
        state.StartingScreen = false;
      });
      set((state) => {
        state.UserName = userName;
      });
      axios
        .post("http://localhost:5000/get_conversation", {
          userEmail: get().Email,
          chatEmail: chatEmail,
        })
        .then((response) => {
          console.log(response.data);
          set((state) => {
            state.Conversation = response.data;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleConversation: (Email, CurrentRoomID, message) => {
      console.log(Email, CurrentRoomID, message);
      const event = new Date();
      if (message !== "") {
        set((state) => ({
          Conversation: [
            ...state.Conversation,
            {
              sender: Email,
              receiver: CurrentRoomID,
              message: message,
              time: event.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
              }),
            },
          ],
        }));
      }
      console.log(get().Conversation);
      set((state) => {
        state.message = "";
      });
    },
    handleSettings: () => {
      set((state) => {
        state.ShowSettings = !state.ShowSettings;
      });
    },
    handleSettingsFalse: () => {
      set((state) => {
        state.ShowSettings = false;
      });
    },
    handleSendMessage: (e) => {
      set((state) => {
        state.message = e.target.value;
      });
    },
    setFullName: (name) => {
      set((state) => {
        state.FullName = name;
      });
    },
  }))
);

export default useStore;