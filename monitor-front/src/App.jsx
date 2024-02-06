import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Error from "./components/Error";
import Header from "./components/Header";
import { theme } from "./utils/style/theme";
import { AuthProvider } from "./providers/Auth";
import { SettingProvider } from "./providers/Setting";
import ProtectedRoute from "./components/PrivateComponent";
import ServerProvider from "./providers/Server";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingProvider>
          <ServerProvider>
            <ChakraProvider theme={theme}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Header />
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route
                  path="*"
                  element={
                    <>
                      <Header />
                      <Error />
                    </>
                  }
                />
              </Routes>
            </ChakraProvider>
          </ServerProvider>
        </SettingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
