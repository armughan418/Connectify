import React, { useState } from "react";
import Navbar from "../components/navbar";

function UserConnections() {
  const [tab, setTab] = useState("Followers");

  const tabs = ["Followers", "Following", "Pending", "Connections"];

  return (
    <Navbar>
      <div className="w-full min-h-screen bg-gray-50 flex justify-center py-6 px-4 md:px-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Connections</h1>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-800">6</h2>
              <p className="text-gray-500 text-sm mt-1">Followers</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-800">3</h2>
              <p className="text-gray-500 text-sm mt-1">Following</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-800">1</h2>
              <p className="text-gray-500 text-sm mt-1">Pending</p>
            </div>
            <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-gray-800">4</h2>
              <p className="text-gray-500 text-sm mt-1">Connections</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition 
                  ${
                    tab === t
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition"
              >
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    User Name
                  </h3>
                  <p className="text-sm text-gray-500 truncate">@username</p>
                </div>
                <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-lg text-sm hover:scale-105 transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Navbar>
  );
}

export default UserConnections;
