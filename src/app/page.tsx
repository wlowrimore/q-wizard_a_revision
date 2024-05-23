import Image from "next/image";
import Link from "next/link";
export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="bg-gradient-to-t from-blue-600 via-blue-400 to-blue-300 bg-clip-text text-transparent">
        <h1 className="text-6xl font-bold md:text-8xl">Q&apos;wizard</h1>
      </div>
      <div className="w-full text-center md:text-xl text-neutral-950">
        A fun and exciting way to test your knowledge
      </div>
      <div className="text-2xl text-white bg-neutral-800/80 py-2 px-6 border border-neutral-800/50 rounded-xl hover:text-neutral-800 hover:bg-sky-300 transition duration-300 mt-10">
        <Link href="/signIn">Get Started</Link>
      </div>
    </main>
  );
}
