import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-palette-8 lg:px-10 lg:mx-20 mt-6 rounded-full px-5 mx-5">
        <h1
          className="text-xl font-bold cursor-pointer text-palette-1"
          onClick={() => navigate("/")}
        >
          Paperlytic AI
        </h1>
        <nav>
          <Button
            onClick={() => navigate("/sign-up")}
            className="text-sm hover:underline hover:bg-palette-2 ml-4 rounded-full"
          >
            Sign Up
          </Button>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to AI Research Paper Summarizer
          </h1>
          <p className="text-lg mb-8">
            Upload your research papers and get concise summaries and critiques
            instantly.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/sign-up")}
              className="px-6 py-2 transition"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="px-6 py-2 transition bg-transparent text-palette-1 border-2 border-palette-1 hover:bg-palette-1 hover:text-white hover:border-0"
            >
              Login
            </Button>
          </div>
        </section>{" "}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 border-t">
        © {new Date().getFullYear()} AI Research Summarizer
      </footer>
    </div>
  );
};

export default LandingPage;
