import './App.css';
import NewOfferForm from './offers/NewOfferForm.js';
import NewNeedForm from './needs/NewNeedForm.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './header/Header.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/offers/add" element={<NewOfferForm />}/>
              <Route path="/needs/add" element={<NewNeedForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
