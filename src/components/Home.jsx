import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaPhone,
  FaComments,
} from "react-icons/fa";
import { userProfile } from "../data";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useRef } from "react";

const HomePage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [callHistory, setCallHistory] = useState([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [receiverVirtualNumber, setReceiverVirtualNumber] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [receiverExists, setReceiverExists] = useState(false);
  const [checkingNumber, setCheckingNumber] = useState(false);

  const [messageText, setMessageText] = useState("");

  const [chatHistory, setChatHistory] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [editingName, setEditingName] = useState(null);
  const [nameInput, setNameInput] = useState("");

  const [chatLoading, setChatLoading] = useState(true);

  const navigate = useNavigate();
  const [selectedName, setSelectedName] = useState(null);

  const bottomRef = useRef();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleReceiverChange = async (value) => {
    setReceiverVirtualNumber(value);

    if (value.length === 11) {
      setCheckingNumber(true);
      try {
        const res = await fetch(`https://chatboxbackend-89xz.onrender.com/users/exists/${value}`);
        const data = await res.json();

        if (data.exists) {
          setReceiverExists(true);
          fetchChatHistory(value);
        } else {
          setReceiverExists(false);
          setChatMessages([]);
        }
      } catch (err) {
        console.error("Error checking number:", err);
        setReceiverExists(false);
      } finally {
        setCheckingNumber(false);
      }
    } else {
      setReceiverExists(false);
      setChatMessages([]);
    }
  };

  const fetchCallHistory = async (phone) => {
    if (!phone) return setCallHistory([]);
    setLoadingCalls(true);
    try {
      const response = await fetch(
        `https://chatboxbackend-89xz.onrender.com/calls?phoneNumber=${phone}`
      );
      if (!response.ok) throw new Error("Failed to fetch call history");
      const data = await response.json();
      setCallHistory(data);
    } catch (error) {
      console.error(error);
      setCallHistory([]);
    } finally {
      setLoadingCalls(false);
    }
  };

  const fetchChatHistory = async (receiverNo) => {
    try {
      const res = await fetch(
        `https://chatboxbackend-89xz.onrender.com/chats/${user.virtualNumber}/${receiverNo}`
      );
      const data = await res.json();
      if (res.ok) {
        setReceiverExists(true);
        setChatMessages(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch chat:", err);
      setChatMessages([]);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      // fetchCallHistory(phoneNumber);
      // fetchChatMessages(phoneNumber);
      fetchChatHistory(phoneNumber);
    } else {
      setCallHistory([]);
      setChatMessages([]);
    }
  }, [phoneNumber]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    console.log("User logged out");
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const response = await fetch("https://chatboxbackend-89xz.onrender.com/user/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        alert("Account deleted successfully.");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to delete account"}`);
      }
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Something went wrong while deleting the account.");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const maxLength = 11;
    setShowChat(false);
    setSelectedNumber(value);
    if (/^\d*$/.test(value) && value.length <= maxLength) {
      setPhoneNumber(value);
    }
  };

  const handleStartChat = () => {
    if (phoneNumber.length == 11) {
      handleReceiverChange(phoneNumber);
      setShowChat(true);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await fetch("https://chatboxbackend-89xz.onrender.com/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderVirtualNumber: user.virtualNumber,
          receiverVirtualNumber: phoneNumber,
          message: messageText,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Option 1: Re-fetch all messages
        handleReceiverChange(phoneNumber);
        setShowChat(true);

        fetchChatHistory();

        setMessageText("");
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Message send error:", error);
      alert("Something went wrong");
    }
  };

  const fetchChats = async (number) => {
    setPhoneNumber(number);

    handleReceiverChange(number);
    setShowChat(true);
  };

  const handleCall = async () => {
    if (!phoneNumber) {
      alert("Please enter a valid phone number.");
      return;
    }
    try {
      const response = await fetch("https://chatboxbackend-89xz.onrender.com/api/calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error("Failed to record call");

      await fetchCallHistory(phoneNumber);
      console.log(`Calling ${phoneNumber}...`);
    } catch (error) {
      console.error(error);
      alert("Failed to place call.");
    }
  };

  // fetch users data...
  useEffect(() => {
    const token = localStorage.getItem("token");

    async function fetchUserData() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("https://chatboxbackend-89xz.onrender.com/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setLoadingProfile(true);
        } else {
          alert(data.message);
          navigate('/login');
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Something went wrong. Try again.");
      }
    }

    if (token) {
      fetchUserData();
    } else {
      alert("Login required");
      navigate('/login');
    }
  }, []);

  // fetch chats history but only the number that user's talked...
  useEffect(() => {
    const fetchChatHistory = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const virtualNumber = user?.virtualNumber;

      if (!virtualNumber) {
        console.warn("No virtual number found for current user.");
        return;
      }

      try {
        const response = await fetch(
          `https://chatboxbackend-89xz.onrender.com/users/chats?number=${virtualNumber}`
        );

        const data = await response.json();

        if (response.ok) {
          setChatHistory(data); // Each item: { number, name }
        } else {
          console.error("Failed to fetch chat history:", data);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      } finally {
        setChatLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(()=>{
    const getName = ()=>{
      chatHistory.map((chat,i)=>{
        if(selectedNumber===chat.number){
          setSelectedName(chat.name);
        }
      })
    }
    getName()
  },[selectedNumber])


  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-[#1e293b] shadow-md">
        <h2 className="text-2xl font-bold">Your Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button title="Profile" className="hover:text-yellow-400">
            <FaUser size={22} />
          </button>
          <div className="relative">
            <button
              title="Settings"
              onClick={() => setShowSettings(!showSettings)}
              className="hover:text-yellow-400"
            >
              <FaCog size={25} className="mt-1.5" />
            </button>
            {showSettings && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-md z-50">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="inline mr-2" /> Logout
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                >
                  <FaTrash className="inline mr-2" /> Delete Account
                </button>
                <button
                  onClick={() => navigate("/kyc")}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-100 text-blue-600"
                >
                  🧾 KYC Verification
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-6 space-y-10 flex-grow">
        {/* Welcome */}
        <section className="text-center">
          <div className="flex flex-col items-center mb-4">
            <img
              src={userProfile}
              alt="User Profile"
              className="w-24 h-24 rounded-full border-4 border-yellow-400 shadow-md"
            />
            <h1 className="text-3xl font-bold mt-4"> {user.name}!</h1>
          </div>
          <p className="text-lg text-gray-300">
            You are logged in and ready to connect.
          </p>
        </section>

        {/* Profile */}
        {loadingProfile ? (
          <section className="bg-[#1e293b] rounded-xl p-6 shadow-md text-white duration-500 transition-all">
            <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phone}
            </p>
            <p>
              <strong>Virtual Number:</strong> {user.virtualNumber}
            </p>
            <p>
              <strong>KYC Status:</strong>{" "}
              {user.kycVerified ? "Verified ✅" : "Not Verified ❌"}
            </p>
          </section>
        ) : (
          <section className="bg-[#1e293b] rounded-xl p-6 shadow-md text-white animate-pulse">
            <h2 className="text-2xl font-semibold mb-4">Profile Overview</h2>

            <div className="mb-2 h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="mb-2 h-4 bg-slate-700 rounded w-2/3"></div>
            <div className="mb-2 h-4 bg-slate-700 rounded w-1/3"></div>
            <div className="mb-2 h-4 bg-slate-700 rounded w-2/4"></div>
            <div className="mb-2 h-4 bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
          </section>
        )}

        {/* Call History */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Call History</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {loadingCalls ? (
              <p>Loading call history...</p>
            ) : callHistory.length === 0 ? (
              <p>No calls made yet.</p>
            ) : (
              callHistory.map((call, idx) => (
                <div key={idx}>
                  <p>
                    <strong>{call.phoneNumber}</strong> -{" "}
                    {new Date(call.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Chat Partners History List */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md mb-4">
          <h2 className="text-2xl font-semibold mb-4">Chat History</h2>

          {chatLoading ? (
            <ul className="space-y-2 animate-pulse">
              {[...Array(5)].map((_, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-[#334155] p-3 rounded-lg"
                >
                  <div className="h-4 w-32 bg-gray-500 rounded"></div>
                  <div className="h-8 w-20 bg-yellow-600 rounded"></div>
                </li>
              ))}
            </ul>
          ) : chatHistory.length === 0 ? (
            <p>No previous chats found.</p>
          ) : (
            <ul className="space-y-2">
              {chatHistory.map((chat, idx) => {
                const otherNumber = chat.number;
                const displayName = chat.name;

                return (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-[#334155] p-3 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {editingName === otherNumber ? (
                        <>
                          <input
                            value={nameInput}
                            placeholder="Enter the name"
                            onChange={(e) => setNameInput(e.target.value)}
                            className="bg-gray-500 text-white px-2 py-1 rounded"
                          />
                          <button
                            onClick={async () => {
                              const currentUser = JSON.parse(
                                localStorage.getItem("user")
                              )?.virtualNumber;
                              if (!currentUser) return;

                              await fetch(
                                "https://chatboxbackend-89xz.onrender.com/users/save-name",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    currentUser,
                                    targetNumber: otherNumber,
                                    name: nameInput,
                                  }),
                                }
                              );

                              setEditingName(null);

                              setChatHistory((prev) =>
                                prev.map((c) =>
                                  c.number === otherNumber
                                    ? { ...c, name: nameInput }
                                    : c
                                )
                              );
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 rounded"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <span
                          className="text-white font-medium cursor-pointer"
                          onClick={() => {
                            setEditingName(otherNumber);
                            setNameInput(
                              displayName !== otherNumber ? displayName : ""
                            );
                          }}
                        >
                          {displayName}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedNumber(otherNumber);
                        fetchChats(otherNumber);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded"
                    >
                      Show Chat
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Phone Input and Actions */}
        <section className="bg-[#1e293b] rounded-xl p-6 shadow-md space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Start Communication</h2>
          <input
            type="text"
            placeholder="Enter 11-digit phone number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className="w-full p-3 rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleCall}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPhone className="mr-2" /> Call
            </button>
            <button
              onClick={handleStartChat}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            >
              <FaComments className="mr-2" /> Chat
            </button>
          </div>

          {/* Chat Input */}
          {showChat && phoneNumber.length === 11 && (
  <>
    {selectedNumber && receiverExists && (
      <h3 className="text-xl text-center font-semibold mb-2 text-yellow-300">
        Chatting with:{" "}
        <span className="text-white">
          {selectedName ? selectedName : selectedNumber}
        </span>
      </h3>
    )}

    {receiverExists ? (
      <>
        <div
          className="bg-gray-700 h-[400px] overflow-y-auto rounded-lg p-4 space-y-3 shadow-inner scroll-smooth"
          onScroll={(e) => {
            // Optional: You can track if user scrolled up here if needed
          }}
        >
          {!chatMessages?.chat ? (
            <p className="text-center text-gray-400">Loading chat...</p>
          ) : chatMessages.chat.messages?.length === 0 ? (
            <p className="text-center text-gray-500">
              No messages yet. Start the conversation!
            </p>
          ) : (
            chatMessages.chat.messages.map((msg, index) => {
              const isSender = msg.senderVirtualNumber === user.virtualNumber;

              return (
                <div
                ref={bottomRef}
                  key={index}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      isSender
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <p className="text-xs mt-1 text-right opacity-60">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {/* Dummy div to scroll into view */}
          <div ref={bottomRef} />
        </div>

        <div className="mt-4 flex gap-2 items-center">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className={`px-4 py-2 rounded-lg text-white ${
              messageText.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </>
    ) : (
      <p className="text-red-500 mt-4 text-center">
        Invalid number. Please enter a valid registered number.
      </p>
    )}
  </>
)}

        </section>
      </main>
    </div>
  );
};

export default HomePage;
