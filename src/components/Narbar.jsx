import axios from 'axios';
import { NavLink,useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
const { VITE_APP_HOST } = import.meta.env;

function Narbar(){
    const nickname = useRef(false);
    const navigate = useNavigate();
    
     //登出
    const signOut = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`);
        document.cookie = `token=';expires=${new Date()}`;
        alert(res.data.message);
        } catch (err) {
        alert(err.response.data.message);
        }
        navigate('/');
    };

    //檢查 Token 是否有效
  const checkOut = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
      axios.defaults.headers.common['Authorization'] = token;
      const res = await axios.get(`${VITE_APP_HOST}/users/checkout`);
      nickname.current = res.data.nickname;
    } catch (err) {
      alert(err.response.data.message);
      navigate('/');
    }
  };
   checkOut();
    return(
        <nav>
        <h1>
          <NavLink to='#' ><img
                src='https://github.com/ejchuang/2023-react-todolist/blob/master/src/assets/img/logo.png?raw=true"'
                alt='目前尚無待辦事項'
              /></NavLink>
        </h1>
        <ul>
          <li className='todo_sm'>
            <NavLink to='#' className='formControls_btnLink'>
              <span>{nickname.current}的代辦</span>
            </NavLink>
          </li>
          <li>
            <NavLink to='#' className='formControls_btnLink' onClick={signOut}>
              <span>登出</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    )
}


export default Narbar;