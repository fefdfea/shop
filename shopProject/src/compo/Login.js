import '../css/main.css'
import $ from 'jquery';
import jquery from 'jquery';
import React, { useEffect, useState } from 'react';
import LoginHeader from './LoginHeader';
window.$ = window.jquery = jquery;

function createElem(shopdata,limit){
  let arr = [];
  for(let i =0; i < limit; i++){
    arr.push(
      <a className="item-bx" href={`/detail/${shopdata[i].id}`}>
        <img src={`${shopdata[i].img}`} alt={`상품${i}`} />
        <div className="hoverBox">
          <p>상품명: <span>{shopdata[i].productName}</span></p>
          <p>가격: <span>{shopdata[i].price}</span></p>
        </div>
      </a>
    )
  } 
  return arr;
}

function Login(props){
  let count = 0;
  let [limit,changeLimit] = useState(3);
  let [state,stateChange] = useState(false);
  useEffect(() => {
    //로그인 상태 체크
    $.ajax({
      url: '/Login',
      type: 'get'
    })
    .then(() => {
    })
    .catch((err) => {
      alert(err.responseJSON.message); 
      const a = document.createElement('a');
      a.setAttribute('href','/Sign_in');
      a.click();
     })
  },[])
  return(
    <>
      <LoginHeader/>
      <section>
        <div className="best">
          <h2>BEST</h2>
          <p>가장 많이 팔린 인기상품</p>
          <div className="best_product">
            <a className="best" href="/detail/1">
              <img src="http://drive.google.com/uc?export=view&id=19PzMetNe1qgv6dXhwwtvrVMWPH2OcdPk" alt="상품1" />
            </a>
            <a className="best" href="/detail/3">
              <img src="http://drive.google.com/uc?export=view&id=10k8VKKFFNndxyEDpubSIJ4mL714ULcrY" alt="상품2" />
            </a>
            <a className="best" href="/detail/5">
              <img src="http://drive.google.com/uc?export=view&id=1116nvbWl0RlqPkngAPKUdbASUuU75A-t" alt="상품3" />
            </a>
            <a className="best" href="/detail/8">
              <img src="http://drive.google.com/uc?export=view&id=14fPpXO7sodm-ZvdwVl6VGPByXDjous14" alt="상품4" />
            </a>
            <a className="best" href="/detail/9">
              <img src="http://drive.google.com/uc?export=view&id=1pz8OxkKL-4kRh9G5Biz1Kmc6HoB5VCoz" alt="상품5" />
            </a>
            <a className="best" href="/detail/11">
              <img src="http://drive.google.com/uc?export=view&id=1umYGWoQtH_Fau3CeHYqeWzfCHhJA3M3L" alt="상품6" />
            </a>
          </div>
        </div>
        <div className="best_keywords">
          <h2>TREND KEYWORDS</h2>
          <div className="keywords">
          <span className="trand_keywords">#Gaming headphone</span>
            <span className="trand_keywords">#Gaming keyboard</span>
            <span className="trand_keywords">#Gaming mouse</span>
            <span className="trand_keywords">#Gaming moniter</span>
          </div>
          <div className="trend_product">
            <a href="/detail/6"><img src="http://drive.google.com/uc?export=view&id=1NsyoVjHNzrv4N6drChW5n3Z4OgfuKgp2" alt="상품1" /></a>
            <a href="/detail/8"><img src="http://drive.google.com/uc?export=view&id=14fPpXO7sodm-ZvdwVl6VGPByXDjous14" alt="상품2" /></a>
            <a href="/detail/10"><img src="http://drive.google.com/uc?export=view&id=1KWcrXVewoV_GWS4B2-waNGVshXHE2iD4" alt="상품3" /></a>
            <a href="/detail/15"><img src="http://drive.google.com/uc?export=view&id=1NvBKSb6imDL_60VkEbd6qwDXP9SBshcv" alt="상품4" /></a>
          </div>
        </div>
        <h2 className="title_last">모든 상품</h2>
        <div className="all">
          {
            createElem(props.shop,limit)
          }
          {
            state === true ? <Message/> : null
          }
        </div>
        <div className="more">
          <button className="more_btn" onClick={() => {
            stateChange(true);
            for( let i =3; i <= limit + 3;i++ ){
              count = i;
              if(i == props.shop.length){
                document.querySelector('.more_btn').style.display = 'none';
                break;
              }
            }
            changeLimit(count);
            stateChange(false);
          }}>더보기</button>
        </div>
      </section>
    </>
  )
}

function Message(){
  return(
    <>
      <div>
        <h4>로딩중입니다...</h4>
      </div>
    </>
  )
}


export default Login;