import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { AuthFlow } from "./views/AuthFlow";
import { LogInView } from "./views/LogInView";

function App() {
  const isLoggedIn = useIsLoggedIn();

  return (
    // Responsive padding and max-width container
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center min-h-screen">
      {isLoggedIn ? <AuthFlow /> : <LogInView />}
    </div>
  );
}

export default App;