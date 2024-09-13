import './App.css';
import NewArticleForm from './article/createArticle/NewArticleForm.js';
import LoginForm from './profile/LoginForm.js';
import ShowArticles from './article/viewArticles/ShowArticles.js';
import Article from './article/Article.js';
import CreateAccount from './profile/CreateAccount.js';
import Whiteboard from './whiteboard/Whiteboard.js';
import AddCategoryForm from './admin/AddCategoryForm.js';
import AddMeetingForm from './admin/AddMeetingForm.js';
import AdminPage from './admin/AdminPage.js';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import {AuthProvider, useAuth} from './auth/AuthProvider.js';
import Header from './header/Header.js';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
              <Route path="/article">
                  <Route path="add" element={
                    <ProtectedRoute>
                      <NewArticleForm />
                    </ProtectedRoute>
                  }/>
                  <Route path="add/:meetingId" element={
                    <ProtectedRoute>
                      <NewArticleForm />
                    </ProtectedRoute>
                  }/>
                <Route path="showAll" element={<ShowArticles />}/>
              </Route>
              <Route path="/showArticle">
                <Route path=":offerOrNeed/:id" element={<Article />}/>
              </Route>
              <Route path="/profile/login" element={<LoginForm />}></Route>
              <Route path="/profile/create-account" element={<CreateAccount />}/>
              <Route path="/whiteboard/:meetingId" element={<Whiteboard />}/>
              <Route path='/admin'>
                <Route path="" element={<AdminPage />}/>
                <Route path="add-category" element={<AddCategoryForm />}/>
                <Route path="add-meeting" element={<AddMeetingForm />}/>
              </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );

}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/profile/login" state={{ from: location }}/>;
  }

  // If authenticated, return the children components
  return children;
}

export default App;
