import Link from "next/link";
import React from "react";

const CancelBtn = () => {
  return (
    <div className="w-fit flex items-center justify-center my-6">
      <Link
        href="/"
        className="w-full text-center text-lg tracking-widest text-white font-semibold bg-red-800 py-3 px-16 rounded-full hover:bg-black hover:text-red-400 hover:shadow-[0_0_1.5rem_0_rgba(0,0,0,0.5)] hover:shadow-red-500 transition duration-500"
      >
        Cancel
      </Link>
    </div>
  );
};

export default CancelBtn;
