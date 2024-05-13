import { Route, Routes } from 'react-router-dom';
import SearchPage from './components/SearchPage/SearchPage';

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
