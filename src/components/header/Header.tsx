"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SlideInMenu from "./SlideInMenu";
import Link from "next/link";

export interface SlideInMenuProps {
  session: any;
  isMenuOpen: boolean;
}

const Header: React.FC = () => {
  const { data: session } = useSession();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 z-10 w-screen h-[6rem] flex items-center justify-between px-12 text-neutral-300 bg-neutral-800 border-b-4 border-blue-300 shadow-md shadow-neutral-400">
      <h1 className="text-2xl hover:bg-sky-400/60 hover:text-white transition duration-300 border border-neutral-500 rounded-full px-3 py-1">
        <Link href="/dashboard">Q</Link>
      </h1>
      {session ? (
        <div
          onClick={toggleMenu}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src={session?.user?.image as string}
            width={52}
            height={52}
            alt="user image"
            className="rounded-full"
          />
          <div className="flex flex-col tracking-wider">
            <p className="text-blue-300 text-lg flex items-center gap-2">
              {session?.user?.name}{" "}
            </p>
            <p className="text-blue-100">{session?.user?.email}</p>
          </div>
          <SlideInMenu session={session} isMenuOpen={isMenuOpen} />
        </div>
      ) : null}
    </header>
  );
};

export default Header;
