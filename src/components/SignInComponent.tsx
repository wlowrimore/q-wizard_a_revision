"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import SignInBtn from "./ui/SignInBtn";
import CancelBtn from "./ui/CancelBtn";
import { getFirstName } from "../helpers";

const SignInComponent: React.FC = () => {
  const { data: session } = useSession();
  const firstName = getFirstName();

  return (
    <>
      <div className="w-screen flex flex-col justify-center items-center mt-[11rem]">
        <div className="my-12 space-y-2 text-center">
          {session ? (
            <div className="flex flex-col p-10">
              <p className="text-neutral-600 text-5xl font-bold border border-neutral-700 rounded-lg p-4">
                Welcome back, {firstName}!
              </p>
              <div className="flex-flex-col mt-2 space-y-2 border border-neutral-700 rounded-lg p-10">
                <Link
                  href="/dashboard"
                  className="text-xl text-neutral-800 hover:text-blue-700 transition duration-300"
                >
                  Continue to Your Dashboard
                </Link>
                <div className="flex items-center gap-2">
                  <div className="bg-neutral-950 h-[0.025rem] w-full"></div>
                  <p className="text-lg">or</p>
                  <div className="bg-neutral-950 h-[0.025rem] w-full"></div>
                </div>
                <p
                  className="text-neutral-800 text-xl cursor-pointer hover:text-blue-700 transition duration-300"
                  onClick={() => signOut({ callbackUrl: "/", redirect: true })}
                >
                  SignOut
                </p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-5xl text-blue-500 font-semibold">
                  Welcome to Q&apos;wizard!
                </h1>

                <h2 className="text-xl text-neutral-500 font-semibold">
                  A fun and exciting way to test your knowledge
                </h2>
                <article className="text-neutral-950 text-2xl space-y-6 my-12 px-6 md:px-20 lg:px-[12rem] xl:px-[20rem] 2xl:px[40rem]">
                  <p>
                    In order to use this app, you will first need to sign in.
                    You will be given your very own session id which will record
                    your progress throughout a series of random questions.
                  </p>
                  <p>
                    In your user dashboard, you will have the option of
                    selecting predefined time limits to answer each question.
                    Once you&apos;ve submitted your answer you cannot change it
                    so be certain before submitting.
                  </p>
                  <p>
                    At the end of each round you will be given a score which
                    will be used to determine your average for, both, the
                    individual categories and the overall quiz.
                  </p>
                </article>
              </div>
              <div className="flex flex-col items-center">
                <SignInBtn />
                <CancelBtn />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignInComponent;
