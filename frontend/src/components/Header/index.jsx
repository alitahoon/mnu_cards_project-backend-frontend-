import React from "react";

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-6">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Abdullah Elseginy</h1>
                <p className="text-lg italic">React Native Developer</p>
            </div>
        </header>
    );
};

export default Header;
