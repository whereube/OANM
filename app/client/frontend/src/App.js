import './App.css';
import NewArticleForm from './article/createArticle/NewArticleForm.js';
import LoginForm from './profile/LoginForm.js';
import ShowArticles from './article/ShowArticles.js';
import Article from './article/Article.js';
import CreateAccount from './profile/CreateAccount.js';
import Whiteboard from './whiteboard/Whiteboard.js';
import AddCategoryForm from './admin/AddCategoryForm.js';
import AddMeetingForm from './admin/AddMeetingForm.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from './header/Header.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/article">
                <Route path="add" element={<NewArticleForm />}/>
                <Route path="add/:meetingId" element={<NewArticleForm />}/>
                <Route path="showAll" element={<ShowArticles />}/>
              </Route>
              <Route path="/showArticle">
                <Route path=":offerOrNeed/:id" element={<Article />}/>
              </Route>
              <Route path="/profile/login" element={<LoginForm />}></Route>
              <Route path="/profile/create-account" element={<CreateAccount />}/>
              <Route path="/whiteboard/:meetingId" element={<Whiteboard />}/>
              <Route path="/admin/add-category" element={<AddCategoryForm />}/>
              <Route path="/admin/add-meeting" element={<AddMeetingForm />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
