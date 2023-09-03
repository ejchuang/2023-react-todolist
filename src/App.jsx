import { Routes, Route , NavLink} from 'react-router-dom';
import Login from "./Login";
import Signup from './Signup';
import Todo from './Todo';

function App() {
  return (
    <>
     
      <Routes>
        {/* {路由表} 路徑/元件 */}
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Todo" element={<Todo />} />

         {/*都找不到就跑這個 */}
        {/* <Route path="*" element={ <NotFound/>} /> */}
      </Routes>

      
    </>
  );
}

export default App;
