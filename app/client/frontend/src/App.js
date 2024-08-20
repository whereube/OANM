import './App.css';
import NewOfferForm from './offers/NewOfferForm.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './header/Header.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<NewOfferForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
