import React , {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import qs from 'qs';
import { useMarketStore } from './store';


const Login = () => {
    const navigate = useNavigate();
    const [ id , setId] = useState('');
    const [pw, setPw] = useState('');
    
  
    const idHandleChange = (event) => {
      const { value } = event.target;
      setId(value);
    }
  
    const pwHandleChange = (event) => {
      setPw(event.target.value);
    }
    
    const { marketInfo , setMarketInfo} = useMarketStore();

    const onLogin = (event) => {
        event.preventDefault();
        const hashPW = CryptoJS.SHA256(pw).toString(CryptoJS.enc.Hex);
        
        var data = qs.stringify({
          'pCenterId' : id,
          'pCenterPw' : hashPW,
        })
        var config = {
          method: 'post',
          url: 'https://testapi.smartjangbogo.com/app/ct/center/login.json',
          headers: {},
          data: data
        }
    
        axios(config).then((res)=>{
          if(res.data.API_CODE.rtcode === "10"){
            alert(`${res.data.API_CODE.rtmsg}`)
          } else if(res.data.API_CODE.rtcode === "1"){
            setMarketInfo(res.data.marketInfo);
            localStorage.setItem('saveid', id);
            sessionStorage.setItem('marketinfo', JSON.stringify(res.data.marketInfo))
            navigate("/main");
          }
        })
      }
    
    useEffect(()=> {
        setId(localStorage.getItem('saveid'))
    },[])

  return (
    <div>
        <form onSubmit={onLogin}>
            <p>아이디</p>
            <input type="text" name='id' value={id} onChange={idHandleChange}/>
            <p>비밀번호</p>
            <input type="password" name='pw' value={pw} onChange={pwHandleChange}/>
            <p></p>
            <button>로그인</button>
        </form>
    </div>
  )
}

export default Login