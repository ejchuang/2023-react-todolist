import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCircleXmark, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons'; 
import { NavLink,useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Narbar from "./components/Narbar";
const { VITE_APP_HOST } = import.meta.env;

function TodoList({ tag, changeTag, todos, getTodo }) {

  //過濾代辦事項狀態
  const filterTodo = useMemo(() => {
    return todos.filter((item) => {
      switch (tag) {
        case '全部':
          return item;
        case '待完成':
          return !item.status;
        case '已完成':
          return item.status;
      }
    });
  }, [todos]);

  //切換代辦事項狀態
  const toggleTodo = async (e, id) => {
    try {
      await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`);
      getTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  //刪除代辦事項
  const delTodo = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`${VITE_APP_HOST}/todos/${id}`);
      getTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  //清除已完成項目
  const clearTodo = async (e) => {
    e.preventDefault();
    try {
      const finishTodos = todos.filter(
        (todo) =>
          todo.status && axios.delete(`${VITE_APP_HOST}/todos/${todo.id}`)
      );

      if (!finishTodos.length) {
        alert('沒有已完成項目');
        return;
      }
      await Promise.all(finishTodos);
      getTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  return (
    <div className='todoList_list'>
      <ul className='todoList_tab'>
        <li>
          <a
            href='#'
            className={tag === '全部' ? 'active' : ''}
            onClick={changeTag}
          >
            全部
          </a>
        </li>
        <li>
          <a
            href='#'
            className={tag === '待完成' ? 'active' : ''}
            onClick={changeTag}
          >
            待完成
          </a>
        </li>
        <li>
          <a
            href='#'
            className={tag === '已完成' ? 'active' : ''}
            onClick={changeTag}
          >
            已完成
          </a>
        </li>
      </ul>
      <div className='todoList_items'>
        <ul className='todoList_item'>
          {filterTodo.map((todo) => {
            return (
              <li key={todo.id}>
                <label className='todoList_label'>
                  <input
                    className='todoList_input'
                    type='checkbox'
                    value={todo.status}
                    checked={todo.status}
                    onChange={(e) => toggleTodo(e, todo.id)}
                  />
                  <span>{todo.content}</span>
                  <FontAwesomeIcon icon={faCircleXmark} className='ms-auto' onClick={(e) => delTodo(e, todo.id)} />
                </label>
                
              </li>
            );
          })}
          {!filterTodo.length && <li className='todoList_label' style={{justifyContent: 'center'}}>請查看其他列表</li>}
        </ul>
        <div className='todoList_statistics'>
          <p> {todos.filter((todo) => !todo.status).length} 個待完成項目</p>
          <a onClick={clearTodo} >清除已完成項目</a>
        </div>
      </div>
    </div>
  );
}

TodoList.propTypes = {
    tag: PropTypes.string,
    changeTag: PropTypes.func,
    todos: PropTypes.array,
    getTodo: PropTypes.func,
}

function Todo() {
  const nickname = useRef(false);
  const [todos, setTodos] = useState([]);
  const [tag, setTag] = useState('全部');
  const newTodo = useRef();
  const navigate = useNavigate();

  //callbackFunction,[條件]
  useEffect(() => {
    checkOut();
    getTodo();}, [tag]);

  //取得所有代辦事項
  const getTodo = async () => {
    try {
      const res = await axios.get(`${VITE_APP_HOST}/todos`);
      const { data } = res.data;
      setTodos(data);
    } catch (err) {
      alert(err.response.data.message);
    }
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
 
  //切換狀態標籤
  const changeTag = (e) => {
    e.preventDefault();
    setTag(e.target.textContent);
  };

  //新增代辦事項
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      if (!newTodo.current.value) {
        alert('請輸入待辦事項');
        return;
      }
      await axios.post(`${VITE_APP_HOST}/todos`, {
        content: newTodo.current.value.trim(),
      });
      newTodo.current.value = '';
      getTodo();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

 
  return (
    <div id='todoListPage' className='bg-half'>
      <Narbar/>
      <div className='conatiner todoListPage vhContainer'>
        <div className='todoList_Content'>
          <div className='inputBox'>
            <input type='text' placeholder='新增待辦事項' ref={newTodo} />
            <a onClick={addTodo} >
              <FontAwesomeIcon icon={faPlus} color="white" />
            </a>
          </div>
          {todos.length ? (
            <TodoList
              tag={tag}
              changeTag={changeTag}
              todos={todos}
              getTodo={getTodo}
            ></TodoList>
          ) : (
            <div className='mt-3'>
              <p className='text-center'>目前尚無待辦事項</p>
              <img
                src='/src/assets/img/empty.png'
                alt='目前尚無待辦事項'
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Todo;
