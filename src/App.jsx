import React from "react";
import Calendar from "./components/calendar";

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Calendar</h1>
      <Calendar />
    </div>
  );
}
