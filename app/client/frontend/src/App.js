import './App.css';
import NewOfferForm from './offers/NewOfferForm.js';
import NewNeedForm from './needs/NewNeedForm.js';
import LoginForm from './profile/LoginForm.js';
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
              <Route path="/profile/login" element={<LoginForm />}></Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
