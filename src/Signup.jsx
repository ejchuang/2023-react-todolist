import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Leftimg from './components/Leftimg';
const { VITE_APP_HOST } = import.meta.env;

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, } = useForm({
    defaultValues:{
    email: '',
    password: '',
    nickname: '',
    checkPwd: '',
    },
    mode: 'onTouched'
  })

  const onSubmit = async (data) => {
    if(data.password !== data.checkPwd) {
      alert('兩次密碼不一樣')
      return
    }

    try {
      await axios.post(`${VITE_APP_HOST}/users/sign_up`, data);
      alert('註冊成功');
      navigate('/');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div id='signUpPage' className='bg-yellow'>
      <div className='conatiner signUpPage vhContainer'>
        <div className='side'>
          <Leftimg/>
        </div>
        <div>
          <form className='formControls' action='index.html' onSubmit={handleSubmit(onSubmit)}>
            <h2 className='formControls_txt'>註冊帳號</h2>
            <label className='formControls_label' htmlFor='email'>
              Email
            </label>
            <input
              className='formControls_input'
              type='text'
              id='email'
              {...register('email', {required: {value: true, message: 'Email必填'}, pattern: {value: /^\S+@\S+$/i, message: 'Email格式錯誤'}})}
              placeholder='請輸入Email'
            />
            <p style={{color: 'red'}}>{errors.email && errors.email.message}</p>
            
            <label className='formControls_label' htmlFor='name'>
              您的暱稱
            </label>
            <input
              className='formControls_input'
              type='text'
              {...register('nickname',{required: {value: true, message: '暱稱必填'}})}
              id='name'
              placeholder='請輸入您的暱稱'
            />
            <p style={{color: 'red'}}>{errors.nickname && errors.nickname.message}</p>
            <label className='formControls_label' htmlFor='pwd'>
              密碼
            </label>
            <input
              className='formControls_input'
              type='password'
              {...register('password',{required: {value: true, message: '密碼必填'}, minLength: {value: 6, message: '密碼不可低於 6 個字元'}})}
              id='pwd'
              placeholder='請輸入密碼'
            />
            <p style={{color: 'red'}}>{errors.password && errors.password.message}</p>
            <label className='formControls_label' htmlFor='checkPwd'>
              再次輸入密碼
            </label>
            <input
              className='formControls_input'
              type='password'
              {...register('checkPwd',{required: {value: true, message: '確認密碼必填'}, minLength: {value: 6, message: '確認密碼不可低於 6 個字元'}})}
              id='checkPwd'
              placeholder='請再次輸入密碼'
            />
            <p style={{color: 'red'}}>{errors.checkPwd && errors.checkPwd.message}</p>
            <input
              className='formControls_btnSubmit'
              type='submit'
              value='註冊帳號'
            />
            <NavLink to='/' className='formControls_btnLink'>
              <p>登入</p>
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Signup;
