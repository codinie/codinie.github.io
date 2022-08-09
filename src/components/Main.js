import axios from 'axios';
import React ,{useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import useInterval from './useInterval';
import qs from 'qs';





const Main = () => {
  const [data, setData] = useState();
  const marketInfo = JSON.parse(sessionStorage.getItem('marketinfo'))
  const [clock , setClock] = useState({});
  const getClock = ()=>{
    const today = new Date();
    var year = String(today.getFullYear());
    var month = String(today.getMonth()+1).padStart(2, "0");
    var date = String(today.getDate()).padStart(2, "0");
    var hours = String(today.getHours()).padStart(2, "0");
    var minutes = String(today.getMinutes()).padStart(2, "0");
    var seconds = String(today.getSeconds()).padStart(2, "0");


    setClock({
      year: year,
      month: month,
      date: date,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    })
  }

  const Order = ({item:i})=>{
    const item = i;

    var orderGubunTrans = (item) => {
      if(item.orderGubun === "A"){
        return "포장"
      } else if(item.orderGubun === "B"){
        return "배달"
      }
    }
    var orderGubunTxt = orderGubunTrans(item);

    var orderStateTrans = (item) => {
      if(item.orderState === "1"){
        return "신규"
      } else if(item.orderState === "2"){
        return "상품준비"
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
    var orderStateTxt = orderStateTrans(item);

    return(
      <tr>
        <td>{item.orderDate}</td>
        <td>{item.orderMainNo}</td>
        <td>{item.basketNo}</td>
        <td>{orderStateTxt}</td>
        <td>{orderGubunTxt}</td>
        <td>{item.orderItemTxt}</td>
        <td>
          <Link to={`/orderinfo/${item.orderMainNo}`}>
            <button>더보기</button>
          </Link>
        </td>
      </tr>
    )
  }
  var audio = new Audio('orderalarm.mp3')


  const loadingOrder = () =>{
    const apidata = qs.stringify({
      'pCenterId': marketInfo.centerId,
      'pMarketNo': marketInfo.marketNo,
      'pOrderType': '1',
      'pOrderBy': 'ORDER_DATE_DESC'
    })
    const config = {
      method: 'post',
      url : 'https://testapi.smartjangbogo.com/app/ct/main/get_order_list.json',
      headers:{},
      data: apidata
    }
    axios(config)
      .then((res) =>{
        var orderList = res.data.orderList;
        if(data && data.length !== orderList.length){
          audio.play();
        }
        setData(orderList);
      })
  }

  useInterval(()=>{
    getClock();
  }, 1000)
  
  useEffect(()=>{
    getClock();
    loadingOrder();
  },[])



  useInterval(()=>{
    loadingOrder();
  }, 600000)

 


  return (
    <>
      <img src="img_logo.svg" alt="" className="logo" />
      <h2>센터 관리 프로그램</h2>
      <div style={{display:"flex", flexWrap: "wrap"}}>
        <h3>{clock.year}-{clock.month}-{clock.date} {clock.hours}:{clock.minutes}:{clock.seconds}</h3>
        <h3>시장명 : {marketInfo.marketName}</h3>
        <h3>오늘 주문 수 : {data && data.length}</h3>
      </div>
      <table>
        <td>주문일시</td>
        <td>주문번호</td>
        <td>장바구니</td>
        <td>상태</td>
        <td>구분</td>
        <td>주문상품</td>
        <td>상세보기</td>
        {data && data.map((data)=>{
          return <Order item={data} key={data.id}/>
        })}
      </table>
    </>
  )
}

export default Main