"use client";

import Image from "next/image";
import { SlideInMenuProps } from "./Header";
import { signOut } from "next-auth/react";
import Link from "next/link";

const SlideInMenu: React.FC<SlideInMenuProps> = ({ session, isMenuOpen }) => {
  return (
    <div
      className={`absolute top-20 right-0 py-3 pl-12 pr-6 z-20 flex flex-col items-start justify-center space-y-2 w-full h-[15rem] bg-neutral-800/90 backdrop-blur text-white text-lg border-2 border-neutral-800 transition-transform duration-500 transform ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Slide-In Menu Content */}
      <div className="flex gap-2">
        <Image
          src={session?.user?.image as string}
          alt={session?.user?.name as string}
          width={500}
          height={500}
          className=" border border-white/60 rounded-full w-32 h-32 my-3"
        />
        <div className="flex flex-col items-start justify-center space-y-2">
          <p className="w-full text-white text-xl hover:bg-neutral-900/20 py-2 pl-6 pr-[8rem] transition duration-300 rounded-2xl">
            View Quizzes
          </p>
          <Link
            href="/dashboard"
            className="w-full text-white text-xl hover:bg-neutral-900/20 py-2 pl-6 pr-[8rem] transition duration-300 rounded-2xl"
          >
            Dashboard
          </Link>
          <p
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="w-full text-white text-sm hover:bg-neutral-900/20 py-2 pl-6 pr-[8rem] transition duration-300 rounded-2xl"
          >
            Sign Out
          </p>
        </div>
      </div>
    </div>
  );
};

export default SlideInMenu;
