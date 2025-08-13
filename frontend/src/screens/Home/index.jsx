import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { MNU_BackGround } from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import CustomBottom from "../../components/Bottom";
import { gettestdata } from "../../redux/slices/userdata";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState("");

  const { testDaata } = useSelector((state) => state.studentdata);

  useEffect(() => {
    dispatch(gettestdata());
  }, [dispatch]);

  // Egyptian National ID Regex: 14 digits, starting with 2 or 3 for century
  const egyptianIdRegex = /^(2|3)\d{13}$/;

  const handleLogin = (e) => {
    e.preventDefault();

    if (!egyptianIdRegex.test(idNumber)) {
      setError("Please enter a valid Egyptian National ID (14 digits)");
      return;
    }
    setError("");

    // ✅ Here you can call your API instead of navigate
    // Example:
    // dispatch(yourApiAction(idNumber));

    navigate("/StudentDetails");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${MNU_BackGround})`,
      }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home</title>
      </Helmet>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-75"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[90%] md:w-1/3 border border-white/30 m-2">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Card System
        </h1>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="idNumber"
            className="block text-white font-medium mb-2"
          >
            Enter Your ID Number
          </label>
          <input
            type="text"
            id="idNumber"
            placeholder="ID Number"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              error ? "border-red-500" : "border-white/40"
            } bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all duration-300`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <CustomBottom
            text="Login"
            onClick={handleLogin}
            styles="mt-5 w-full"
            buttonStyles="justify-center w-full"
          />
        </form>

        <h4 className="text-white mt-5">our data = {testDaata?.description}</h4>
        <h4 className="text-white">our data = {testDaata?.emoji}</h4>
      </div>
    </div>
  );
}
