"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

const SignInBtn: React.FC = () => {
  return (
    <div className="flex bg-black w-fit pl-3 pr-5 py-1 gap-2 rounded-full hover:shadow-[0_0_1.5rem_0_rgba(0,0,0,0.5)] hover:shadow-blue-500 transition duration-500">
      <Image
        src="/images/logos/google.jpg"
        width={32}
        height={32}
        alt="google logo"
        className=" py-2.5 px-1 rounded-full"
      />
      <button
        className="bg-black rounded-r-full text-white/60 text-xl hover:text-blue-300 transition duration-300 font-semibold tracking-wide pl-1 py-2"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        SignIn with Google
      </button>
    </div>
  );
};

export default SignInBtn;
