import { useState , useEffect} from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Main from './components/Main';
import OrderInfo from './components/OrderInfo';

import axios from 'axios';
import './App.css';

function App() {
  const [loading , setLoading] = useState(false);
 
  function serverCheck (){
    setLoading(true);
    var config = {
      method: 'post',
      url: 'https://testapi.smartjangbogo.com/app/ct/check/server_check.json',
      headers: { },
    };
    
    axios(config)
    .then((res) => {
      if(res.data.API_CODE.rtcode === "1"){
        setLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }




  useEffect(()=>{
    serverCheck();
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        {loading
        ?<h1>Now loading...</h1>
        :<Routes>
          <Route path="/" element = {<Login/>} />
          <Route path="/main" element = {<Main/>} />
          <Route path="/orderinfo/:orderno" element = {<OrderInfo/>} />
        </Routes>
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
