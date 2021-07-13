import React, {useEffect,useState} from 'react'
import { Link } from 'react-router-dom';
import $ from 'jquery';
import jquery from 'jquery';
window.$ = window.jquery = jquery;

function logout(){
  $.ajax({
    type: 'get',
    url: '/logout'
  })
  .then(() => {
    const a = document.createElement('a');
    a.setAttribute('href','/');
    a.Click();
  })
  .catch((err) => {
    alert(err.responseJSON.message);
  })
}

function LoginHeader() {
  let [datalang,setDataLang] = useState();
  useEffect(() => {
     //상품갯수 가져오기
     $.ajax({
       type: 'get',
       url: '/cart_list_info',
     })
     .then((data) => {
       if(data){
        setDataLang(data.productId.length);
       }else{
         setDataLang(0);
       }
     })
     .catch((err) => {
        alert(err.responseJSON.message);
     })
  },[])
  return (
    <>
      <header>
        <h1>Gaming Shop</h1>
          <div className="top_nav">
            <ul className="top_list">
            <li><Link to="/Login">메인</Link></li>
              <li><Link to="/Mypage">마이페이지</Link></li>
              <li><Link to="/Order_list">장바구니</Link><span className="productCount">{datalang}</span></li>
              <li><Link to="/"  onClick={logout}>로그아웃</Link></li>
            </ul>
        </div>
      </header>
    </>
  )
}

export default LoginHeader
