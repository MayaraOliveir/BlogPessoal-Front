import Home from "./pages/home/Home"
import "./pages/home/Home.css"
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./pages/cadastro/Cadastro";
import Login from "./pages/login/Login"
import { AuthProvider } from "./contexts/AuthContext";
import ListaTemas from "./components/tema/listatemas/ListaTemas";

const App = () => {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="min-h-[80vh]">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/temas" element={<ListaTemas />} />
          </Routes>
        </div>
        <Footer/>
        </BrowserRouter>
        </AuthProvider>
    </>
  );
};

export default App;
