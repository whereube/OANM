import './App.css';
import NewOfferForm from './offers/NewOfferForm.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<NewOfferForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
