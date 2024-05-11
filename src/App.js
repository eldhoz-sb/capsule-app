import { Route, Routes } from 'react-router-dom';
import SearchPage from './components/SearchPage/SearchPage';
import './App.css';

function App() {
  return (
   <>
   <Routes>
   <Route path='/' element={<SearchPage />}></Route>
   </Routes>
   </>
  );
}

export default App;
