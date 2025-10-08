import ChatNav from "@/components/ChatNav";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex flex-col border-r bg-palette-9">
        <div className="py-4 flex justify-center items-center">
          <a href="/chat" className="block">
            <img src="assets/logo.svg" alt="logo" width={30} />
          </a>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          <ChatNav setIsOpen={setIsOpen} />
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-palette-7 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0 w-70" : "-translate-x-full w-70"}`}
      >
        <div className="flex justify-between items-center py-4 px-4 border-b">
          <a href="/chat" className="block">
            <img src="assets/logo.svg" alt="logo" width={20} />
          </a>
          <button onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-6">
          <ChatNav setIsOpen={setIsOpen} showText />
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-4">
          <button
            className="rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <a href="/chat" className="block">
            <img src="assets/logo.svg" alt="logo" width={20} />
          </a>
        </div>
        <main className="flex-1 p-6 overflow-y-auto mt-10 xl:mt-0 lg:mt-0 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
