import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import ControlLayer from "./layouts/ControlLayer";
import AuthButton from "./components/Global/AuthButton";
import Widget from "./components/Global/Widget";
const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <ControlLayer>
        <AuthButton />
        <Widget />
      </ControlLayer>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
