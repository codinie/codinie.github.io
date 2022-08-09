import React, { useEffect, useState } from 'react'
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Modal from './Modal';

const OrderInfo = () => {
    const sessionData = JSON.parse(sessionStorage.getItem('marketinfo'))
    const params = useParams();
    const [orderData, setOrderData] = useState({});
    const [itemList, setItemList] = useState([]);
    const [ infoToggle , setInfoToggle ] = useState(false);
    const [ type , setType ] = useState(false)
    const navigate = useNavigate();
    const data = qs.stringify({
        'pCenterId' : sessionData.centerId,
        'pMarketNo' : sessionData.marketNo,
        'pOrderType' : "1",
        'pOrderMainNo' : params.orderno
    })

    const [cancelModal, setCancelModal]= useState(false);

    const openModal = () =>{
      setCancelModal(true);
    }

    const closeModal = () =>{
      setCancelModal(false);
    }

;    var config = {
        method: 'post',
        url: 'https://testapi.smartjangbogo.com/app/ct/main/get_order_info.json',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };

      const apiOrder = ()=>{
        axios(config)
        .then((res)=>{
            if(res.data.API_CODE.rtcode ==="1"){
                setOrderData(res.data.orderInfo);
                setItemList(res.data.itemList);
                if(res.data.orderInfo.orderGubun === "A"){
                    setType(true);
                } else if(res.data.orderInfo.orderGubun === "B"){
                    setType(false);
                }
            }
        })
      }


      var orderTypeTrans = (orderData) => {
        if(orderData.orderType === "1"){
          return "장보기"
        } else if(orderData.orderType === "2"){
          return "택배"
        }
      }

      var orderTypeTxt = orderTypeTrans(orderData);

      var orderGubunTrans = (orderData) => {
        if(orderData.orderGubun === "A"){
          return "포장"
        } else if(orderData.orderGubun === "B"){
          return "배달"
        }
      }

      var orderGubunTxt = orderGubunTrans(orderData);


      var orderStateTrans = (item) => {
        if(item.orderState === "1"){
          return "신규"
        } else if(item.orderState === "2"){
          return "상품준비중"
        } else if(item.orderState === "3"){
          return "픽업대기"
        } else if(item.orderState === "4"){
          return "픽업완료"
        } else if(item.orderState === "5"){
          return "배달중"
        } else if(item.orderState === "6"){
          return "배달완료"
        } else if(item.orderState === "7"){
          return "주문취소요청"
        } else if(item.orderState === "9"){
          return "주문취소완료"
        } 
      }

      var orderStateTxt = orderStateTrans(orderData);

      const ItemList = ({item:i})=>{
        const item = i;

        var optTxtTrans = (item) =>{
            if(item.optTxt === ""){
                return "-"
            }
        }
        var settingOptTxt = optTxtTrans(item);

        var itemStateTrans = (item) => {
            if(item.orderState === "1"){
              return "상품준비"
            } else if(item.orderState === "2"){
              return "입고"
            } else if(item.orderState === "3"){
              return "픽업대기"
            } else if(item.orderState === "4"){
              return "픽업완료"
            } else if(item.orderState === "5"){
              return "배달중"
            } else if(item.orderState === "6"){
              return "배달완료"
            } else if(item.orderState === "7"){
              return "주문취소요청"
            } else if(item.orderState === "9"){
              return "주문취소완료"
            } 
          }
          var itemStateTxt = itemStateTrans(item);
        
        return(
            <tr>
                <td>{item.orderNo}</td>
                <td>{item.storeName}</td>
                <td>{item.itemName}</td>
                <td>{settingOptTxt}</td>
                <td>{item.itemCnt}</td>
                <td>{item.itemTotalPrice}</td>
                <td>{itemStateTxt}</td>
            </tr>
        )
      }
    
      const onToggle = ()=> {
        setInfoToggle(true);
      }
      const offToggle = ()=> {
        setInfoToggle(false);
      }

      //픽업 준비완료 처리 api
      const pickReady = ()=>{
        if(orderData.orderState === "2"){
            const confirm = window.confirm('상품준비완료 처리를 진행하시겠습니까?');
            if(confirm === true){
                const data = qs.stringify({
                    'pCenterId' : sessionData.centerId,
                    'pMarketNo' : sessionData.marketNo,
                    'pOrderMainNo' : params.orderno
                })
                const config ={
                    method: 'post',
                    url: 'https://testapi.smartjangbogo.com/app/ct/main/order_ready_proc.json',
                    headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                }
                axios(config).then((res)=>{
                    console.log(res);
                    if(res.data.API_CODE.rtcode === "1"){
                        alert('상품준비완료 처리되었습니다.')
                        window.location.reload();
                    } else {
                        alert('상품준비완료 처리에 실패했습니다.')
                        window.location.reload();
                    }
                })}
        } else {
            alert('상품준비중 상태에서만 완료처리를 진행할 수 있습니다.');
        }
    }

      //픽업완료 처리 api
      const pickEnd = ()=>{
        if(orderData.orderState === "3"){
            const confirm = window.confirm('픽업완료 처리를 진행하시겠습니까?');
            if(confirm === true){
                const data = qs.stringify({
                    'pCenterId' : sessionData.centerId,
                    'pMarketNo' : sessionData.marketNo,
                    'pOrderMainNo' : params.orderno
                })
                const config ={
                    method: 'post',
                    url: 'https://testapi.smartjangbogo.com/app/ct/main/order_finish_proc.json',
                    headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                }
                axios(config).then((res)=>{
                    console.log(res);
                    if(res.data.API_CODE.rtcode === "1"){
                        alert('픽업완료 처리되었습니다.')
                        window.location.reload();
                    } else {
                        alert('픽업완료 처리에 실패했습니다.')
                        window.location.reload();
                    }
                })}
        } else {
            alert('픽업대기 상태에서만 완료처리를 진행할 수 있습니다.');
        }
    }
      

    //배달시작 처리 api
    const deliReady = ()=>{
        if(orderData.orderState === "2"){
            const confirm = window.confirm('배달시작 처리를 진행하시겠습니까?');
            if(confirm === true){
                const data = qs.stringify({
                    'pCenterId' : sessionData.centerId,
                    'pMarketNo' : sessionData.marketNo,
                    'pOrderMainNo' : params.orderno
                })
                const config ={
                    method: 'post',
                    url: 'https://testapi.smartjangbogo.com/app/ct/main/order_rider_start.json',
                    headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                }
                axios(config).then((res)=>{
                    console.log(res);
                    if(res.data.API_CODE.rtcode === "1"){
                        alert('배달시작 처리되었습니다.')
                        window.location.reload();
                    } else {
                        alert('배달시작 처리에 실패했습니다.')
                        window.location.reload();
                    }
                })}
        } else {
            alert('상품준비중 상태에서만 배달시작 처리를 진행할 수 있습니다.');
        }
    }

        //배달완료 처리 api
        const deliEnd = ()=>{
        if(orderData.orderState === "5"){
            const confirm = window.confirm('배달완료 처리를 진행하시겠습니까?');
            if(confirm === true){
                const data = qs.stringify({
                    'pCenterId' : sessionData.centerId,
                    'pMarketNo' : sessionData.marketNo,
                    'pOrderMainNo' : params.orderno
                })
                const config ={
                    method: 'post',
                    url: 'https://testapi.smartjangbogo.com/app/ct/main/order_rider_finish.json',
                    headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data : data
                }
                axios(config).then((res)=>{
                    console.log(res);
                    if(res.data.API_CODE.rtcode === "1"){
                        alert('배달완료 처리되었습니다.')
                        window.location.reload();
                    } else {
                        alert('배달완료 처리에 실패했습니다.')
                        window.location.reload();
                    }
                })}
        } else {
            alert('배달중 상태에서만 완료처리를 진행할 수 있습니다.');
        }
    }

      const saveUser = `번호: ${orderData.basketNo}  받는사람: ${orderData.addrUserName}  연락처: ${orderData.addrPhone}  주소: ${orderData.addr1} ${orderData.addr2}`;

      useEffect(()=>{
        apiOrder();
    },[])
  
    return (
    <React.Fragment>
    <div className='appbar'>
        <div><img src="/img/back.svg" alt="" onClick={()=>{navigate(-1)}}/></div>
        <div><h1>주문상세정보</h1></div>
        <div>
        <CopyToClipboard text={saveUser}>
            <button className="save-btn" onClick={()=>{alert('배송 정보가 저장되었습니다.')}}>주문정보 저장</button>
        </CopyToClipboard>
        </div>        
    </div>
    <div className="state-wrap">
        <div>
            <h2>{orderTypeTxt}({orderGubunTxt})</h2>
            <h2 style={{marginLeft:"20px" , color: "#737373"}}>{orderStateTxt}</h2>
        </div>
        <div>
            <h2>장바구니 번호 : <span style={{marginLeft:"10px", color:"red"}}>{orderData.basketNo}</span></h2>
        </div>
        <div className='btn-wrap'>
            {type
            ?<>
                <button onClick={openModal} className="order-cancel">주문거절</button>
                <button onClick={pickReady}>상품준비완료</button>
                <button onClick={pickEnd}>상품전달</button>
            </>
            :<>
                <button onClick={openModal} className="order-cancel">주문거절</button>
                <button onClick={deliReady}>배달시작</button>
                <button onClick={deliEnd}>배달완료</button>
            </>}
        </div>
    </div>
    {infoToggle
    ?<div className="info-acc-open" >
        <div className="info-acc-open-top" onClick={offToggle}>
            <div></div>
            <h4>주문 정보 더보기</h4>
            <img src="/img/component_3.svg" alt="" />
        </div>
        <div className="info-acc-table">
            <table>
                <td>주문정보</td>
                <td>{orderData.orderMainNo}</td>
                <tr>
                    <td>주문일시</td>
                    <td>{orderData.orderDate}</td>
                </tr>
                <tr>
                    <td>주문금액</td>
                    <td>{orderData.totalSumAmount}</td>
                </tr>
                <tr className="fourth-td">
                    <td></td>
                    <td></td>
                </tr>
            </table>
            <table>
                <td>구매자 ID</td>
                <td>{orderData.userName}({orderData.userId})</td>
                <tr>
                    <td>받는사람</td>
                    <td>{orderData.addrUserName}</td>
                </tr>
                <tr>
                    <td>연락처</td>
                    <td>{orderData.addrPhone}</td>
                </tr>
                <tr className="fourth-td">
                    <td>주소</td>
                    <td>{orderData.addr1} <br />{orderData.addr2}</td>
                </tr>
            </table>
            <table></table>
        </div>
    </div>
    :<div className="info-acc" onClick={onToggle}>
        <div></div>
        <h4>주문 정보 더보기</h4>
        <img src="/img/component_3.svg" alt="" />
    </div>}
    <table className="orderinfo-table">
        <td>상품주문번호</td>
        <td>가게명</td>
        <td>상품명</td>
        <td>옵션명</td>
        <td>수량</td>
        <td>가격</td>
        <td>상태</td>
        {itemList && itemList.map((data)=>{
          return <ItemList item={data} key={data.id}/>
        })}
    </table>
    <Modal open={cancelModal} close={closeModal} header="주문취소">거절사유를 입력하세요.</Modal>
    </React.Fragment>

  )
}

export default OrderInfo;