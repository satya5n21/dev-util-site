import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to = "/" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="fixed top-4 left-4 cursor-pointer
        bg-transparent backdrop-blur-sm
        text-white font-medium
        text-xl px-4 py-2 rounded-xl shadow-md
        hover:text-2xl hover:shadow-lg hover:border-l
        transition-all z-50"
    >{"←"}
    </button>
  )
}
