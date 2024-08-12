import { Navbar, WaitList, About, Features, Team, Footer } from "@/components/landing";
import { Toaster } from "@/components/ui/toaster";

const Landing = () => {
    return (
        <>
            <div className="relative z-0 bg-primary select-none">
                <Navbar />
                <div className="bg-prod-bg bg-cover bg-no-repeat bg-center">
                    <WaitList />
                </div>

                <div className="relative z-0">
                    <About />
                    <Features />
                    <Team />    
                    <Footer />
                </div>
                <Toaster /> {/* Place the Toaster component here */}
            </div>
        </>
    );
}

export default Landing;