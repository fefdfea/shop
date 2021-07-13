import '../css/orderList.css';
import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginHeader from './LoginHeader';
import $ from 'jquery';
import jquery from 'jquery';
window.$ = window.jquery = jquery;
let defaultPrice = [];
let IMP = window.IMP;
//결제 할때 총 가격으로 사용하기 위해 변수 선언
let totalPriceInfo;
IMP.init('imp00862712');


//결제창 호출 함수
function callBuyPage(item,setUser){
  let ProductNumber = new Date().getTime();
  var IMP = window.IMP; // 생략가능
  IMP.init('imp00862712');
  // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
  // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
  IMP.request_pay({
  pg: 'nice', // version 1.1.0부터 지원.
  /*
  'kakao':카카오페이,
  html5_inicis':이니시스(웹표준결제)
  'nice':나이스페이
  'jtnet':제이티넷
  'uplus':LG유플러스
  'danal':다날
  'payco':페이코
  'syrup':시럽페이
  'paypal':페이팔
  */
  pay_method: 'card',
  /*
  'samsung':삼성페이,
  'card':신용카드,
  'trans':실시간계좌이체,
  'vbank':가상계좌,
  'phone':휴대폰소액결제
  */
  merchant_uid: 'merchant_' + ProductNumber,
  name: 'Gaming Shop',
  //결제창에서 보여질 이름
  amount: totalPriceInfo,
  //가격
  buyer_email: item.id,
  buyer_name: '김창규',
  buyer_tel: item.phone,
  buyer_addr: '서울특별시 강남구 삼성동',
  buyer_postcode: '123-456',
  m_redirect_url: 'https://www.yourdomain.com/payments/complete'
  /*
  모바일 결제시,
  결제가 끝나고 랜딩되는 URL을 지정
  (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
  */
  }, function (rsp) {
    //장바구니 상품 제거 성공시 장바구니 갯수 변경을 위해 새로고침 함
    if (rsp.success) {
      let copy = [...item];
      for(let i =0; i < copy.productId.length; i++){
        copy.productId.productNumber = ProductNumber;
      }
      setUser( copy );
      successbuy( copy );
      window.location.reload();
    } else {
    let msg = '결제에 실패하였습니다.';
    msg += '에러내용 : ' + rsp.error_msg;
    }
  });
}
//결제 성공시 장바구니 아이템들을 서버로 전송
function successbuy(item){
  $.ajax({
    type: 'put',
    url: '/successBuy',
    data:{
      cartList : item.productId,
    }
  })
}

function deleteItem(id){
  $.ajax({
    type: 'delete',
    url: '/delete',
    data: {
      id: id
    }
  })
  //장바구니 갯수 변경 적용을 위해 새로고침 효과를 냄
  .done(() => {
    window.location.reload();
  }).catch((err) => {
    alert(err.responseJSON.message);
  });
}

function buyPrice(e,i){
  //수량을 정수로 바꿈
  const targetValue = e.target.value;
  if( targetValue !== "" ){
    const chageTarget = parseInt(targetValue);
    //기본 가격이 들어있응 defaultPrice와 정수로 바꾼 수량을 곱하여 다시 표시
    let total = chageTarget * defaultPrice[i];
    total = total.toString();
    const changeString = total.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    document.querySelectorAll('.price')[i].innerText = changeString;
    totalPrice();
  }
  /*
    문자를 입력하여 수량이 공백이 되었을때 구매금액이 0으로 바뀌도록 설정
  */
  else{
    document.querySelectorAll('.price')[i].innerText = 0;
    totalPrice();
  }
}

//입력한 값의 ,를 빼고 정수로 변경하고 구매금액을 계산하는 함수
function checkNumber(e,i){
  const regex = /^[0-9\b -]{0,13}$/;
  if (regex.test(e.target.value)) {
    if(e.target.value !== ""){
      buyPrice(e,i)
    }else{
      //수량이 공백일시 0으로 체크
      document.querySelectorAll('.price')[i].innerText = 0;
      totalPrice();
    }
  }
   else{
    e.target.value = '';
    alert('숫자만 입력해 주십시오');
    buyPrice(e,i)
  }
}

//총 값을 구하는 함수
function totalPrice(){
  const price = document.querySelectorAll('.price');
  let total = 0;
  for(let i =0; i < price.length; i++){
    const selectOne =  price[i].innerText;
    const remove = selectOne.replace(/,/g , "");
    const changeInt = parseInt(remove);
    total += changeInt;
  }
    totalPriceInfo = total;
    total = total.toString();
    const chageString = total.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    document.querySelector('#totalPrice').innerText = chageString;
}



function OrderList() {
  //주문목록 데이터를 가져옴
  let [list,setUser] = useState();
  useEffect(() => {
    const { IMP } = window;
    IMP.init('imp00862712');

    $.ajax({
      type: 'get',
      url: '/userInfo',
    })
    .then((data) => {
      setUser(data);
      totalPrice();
    })
    .catch((err) => {
      const a = document.createElement('a');
      a.setAttribute('href','Sign_in');
      a.click();
      return err;
    })
  },[])

  return (
    <div>
      <LoginHeader/>
      <section>
        <h2 style={{ textAlign: 'center' , fontSize: '2rem', marginBottom: '1em', marginTop: '2em'}}>장바구니</h2>
        <div className="shopping_list_con">
          <table style={{ borderBottom: '1px solid #999' }}>
            <thead>
              <tr className="table_header">
                <th>이미지</th>
                <th>상품정보</th>
                <th>수량</th>
                <th>구매금액</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
                { list &&
                  list.productId.map((e,i) => {
                  defaultPrice.push(e.price);
                  return(
                    <>
                      <tr className="table_body" key={i}>
                        <td>
                          <a href={`detail/${e.id}`} className="orderlist_img_bx">
                            <img src={`${e.img}`} alt={`상품번호${e.id}`}/> {/* 상품 이미지 */}
                          </a>
                        </td>
                        <td>
                          <p>{e.productName}</p>  { /* 상품정보 */ }
                        </td>
                        <td>
                          <input type="text" defaultValue={e.qua} className="quantity" maxLength="3" onChange={(e) => {
                            checkNumber(e,i);
                          }}/>
                        </td>
                        <td>
                          {/*처음 시작할때 ,없이 값이 나오는 것을 막기위해 정규식을 이용함*/}
                          <span className="price">{e.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>원{/* 구매금액 */}
                        </td>
                        {/* 선택 */}
                        <td>
                          <button className="delete_btn" onClick={() => {
                            deleteItem(e.id);
                          }}>삭제</button>  
                        </td>
                      </tr>
                    </>
                  )
                })
              }
            </tbody>
          </table>
          <div className="orderListTotal">
            총 가격:<span id="totalPrice"></span>원
          </div>
          <div className="btn_area">
            {/* 버튼 클릭시 list의 상품갯수를 변경하여 list에 다시 저장 하고 함수실행 */}
            <button onClick={() => {
               const quan = document.querySelectorAll('.quantity');
               for(let i =0; i < quan.length; i++){
                 if(quan[i].value == "") return alert('상품수량을 입력을 확인해 주십시오')//상품수량이 없을시를 방지
                 let copy = [...list.productId];
                 let changeInt = parseInt(quan[i].value);
                 copy[i].qua = changeInt;
                 setUser(copy);
               }
              callBuyPage(list,setUser);
              }}>결제하기</button>
            <button><Link to="/Login">취소</Link></button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderList
