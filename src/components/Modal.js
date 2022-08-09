import React , {useState} from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';



const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;
  const [cancelReason, setCancelReason] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem('marketinfo'));
  const params = useParams();

  const cancelChange = (event) => {
    setCancelReason(event.target.value);
  }

  const cancelSend = () =>{

    
    const data = qs.stringify({
        'pCenterId':sessionData.centerId,
        'pMarketNo': sessionData.marketNo,
        'pOrderMainNo' : params.orderno,
        'pCancelReason' : cancelReason,
    })

    const config = {
        method: 'post',
        url: 'https://testapi.smartjangbogo.com/app/ct/main/order_cancel_proc.json',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    }

    axios(config).then((res)=>{
        console.log(res);
        if(res.data.API_CODE.rtcode === "1"){
            alert('주문이 취소되었습니다.');
            close();
        }
    })
  }
  


  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? 'openModal modal' : 'modal'}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>{props.children}
            <p><textarea type="textarea" style={{ width:"300px", height:"200px"}} onChange={cancelChange}/></p>
          </main>
          <footer>
            <button style={{ backgroundColor:'red',marginRight:"300px"}} onClick={cancelSend}>
              주문거절
            </button>
            <button className="close" onClick={close}>
              취소
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;