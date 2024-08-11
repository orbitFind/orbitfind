import { BrowserRouter } from "react-router-dom";
import { Navbar, WaitList, About, Features, Footer } from "./components";
import { Toaster } from "@/components/ui/toaster"; // Import the Toaster component
import './globals.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary select-none">
        <div className="bg-prod-bg bg-cover bg-no-repeat bg-center">
          <Navbar />
          <WaitList />
        </div>
        
        <div className="relative z-0">
          <About />
          <Features />
          <Footer />
        </div>
        <Toaster /> {/* Place the Toaster component here */}
      </div>
    </BrowserRouter>
  );
}

export default App;
