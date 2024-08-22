import './App.css';
import NewOfferForm from './offers/NewOfferForm.js';
import NewNeedForm from './needs/NewNeedForm.js';
import LoginForm from './profile/LoginForm.js';
import ShowOffers from './offers/ShowOffers.js';
import ShowNeeds from './needs/ShowNeeds.js';
import Article from './article/Article.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './header/Header.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/offers">
                <Route path="add" element={<NewOfferForm />}/>
                <Route path="showAll" element={<ShowOffers />}/>
              </Route>
              <Route path="/needs">
                <Route path="add" element={<NewNeedForm />}/>
                <Route path="showAll" element={<ShowNeeds />}/>
              </Route>
              <Route path="/showArticle">
                <Route path=":offerOrNeed/:id" element={<Article />}/>
              </Route>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
