import '../css/header.css';
import React, { Link } from 'react-router-dom'

function Header() {

  return (
    <>
        <header>
          <h1>Gaming Shop</h1>
          <div className="top_nav">
          <ul className="top_list">
            <li><Link to="/">메인</Link></li>
            <li><Link to="/Sign_up">회원가입</Link></li>
            <li><Link to="/Sign_in">로그인</Link></li>
            <li><Link to="/Mypage">마이페이지</Link></li>
            <li><Link to="/Order_list">장바구니</Link><span className="productCount"></span></li>
          </ul>
        </div>
      </header>
    </>
  )
}

export default Header
