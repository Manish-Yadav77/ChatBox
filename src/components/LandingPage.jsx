import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRegThumbsUp,
  FaRocket,
  FaPhoneAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { project1, project2, project3, bg1, bg2, bg3 } from "../data";

const LandingPage = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [prevBgIndex, setPrevBgIndex] = useState(0);
  const backgrounds = [bg1, bg2, bg3];
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevBgIndex(bgIndex);
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bgIndex]);

  useEffect(() => {
    const fetchMyData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found...");
        return;
      }

      try {
        const response = await fetch(`https://chatboxbackend-89xz.onrender.com/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("my data:\n", data);
          if(data.role==="user"){
            navigate('/home');
          }
        } else {
          console.error("Failed to fetch my data:", data);
        }
      } catch (err) {
        console.error("Error fetching my data history:", err);
      }
    };

    fetchMyData();
  }, []);

  return (
    <div className="bg-[#0f172a] text-white">
      {/* Hero Section with Sliding Background */}
      <section className="relative h-screen text-white flex justify-center items-center text-center overflow-hidden">
        {backgrounds.map((bg, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: index === bgIndex ? 20 : 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === bgIndex ? 1 : 0 }}
            transition={{ duration: 3 }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-60 z-30"></div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-40"
        >
          <h1 className="text-5xl font-extrabold mb-4 px-12">
            Revolutionizing Communication
          </h1>
          <p className="text-xl mb-8 px-20">
            Create an account, verify with your phone, and start connecting with
            anyone, anywhere—without using a SIM card.
          </p>
          <div className="px-8">
            <Link
              to="/login"
              className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg mx-2 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg mx-2 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1e293b] text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaRocket className="text-4xl text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-gray-300">
              Connect instantly with anyone, anywhere. Lightning-fast connection
              speeds.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FaShieldAlt className="text-4xl text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-300">
              Your privacy is our top priority. We ensure end-to-end encryption
              for all communications.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <FaPhoneAlt className="text-4xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No SIM Card Needed</h3>
            <p className="text-gray-300">
              Say goodbye to SIM cards. Communicate using a unique ID and phone
              number.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <FaRegThumbsUp className="text-4xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
            <p className="text-gray-300">
              Our platform is intuitive, making it easy for you to connect with
              anyone in just a few clicks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="bg-[#0f172a] py-20">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          Our Work
        </h2>
        <div className="overflow-hidden">
          <Marquee>
            {[project1, project2, project3, project1, project2, project3].map(
              (src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt={`Project ${index + 1}`}
                  className="w-72 h-48 object-cover rounded-lg shadow-lg ml-5"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              )
            )}
          </Marquee>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Ready to get started?
        </motion.h2>
        <p className="text-xl mb-8">
          Join us today and take the first step towards a new way of
          communication.
        </p>
        <Link
          to="/signup"
          className="bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-lg text-white font-semibold transition duration-300"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#0f172a] text-center text-gray-400">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
