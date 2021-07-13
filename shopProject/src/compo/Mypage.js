import '../css/Mypage.css';
import { useEffect,useState } from 'react';
import LoginHeader from "./LoginHeader";
import $ from 'jquery';
import jquery from 'jquery';
window.$ = window.jquery = jquery;

// 구매취소 요청 함수
async function cancleOrder(productId,productData){

  await $.ajax({
    "url": "/payments/cancel",
    "type": "POST",
    "contentType": "application/json",
    "data": JSON.stringify({
      "merchant_uid": "mid_" + productData.productData, // 주문번호
      "cancel_request_amount": productData.totalPrice, // 환불금액
      "reason": "테스트 결제 환불", // 환불사유
      "refund_holder": "홍길동", // [가상계좌 환불시 필수입력] 환불 수령계좌 예금주
      "refund_bank": "88", // [가상계좌 환불시 필수입력] 환불 수령계좌 은행코드(ex. KG이니시스의 경우 신한은행은 88번)
      "refund_bank": "88", // [가상계좌 환불시 필수입력] 환불 수령계좌 은행코드(ex. KG이니시스의 경우 신한은행은 88번)
      "refund_account": "56211105948400", // [가상계좌 환불시 필수입력] 환불 수령계좌 번호
    }),
    "dataType": "json"
  })
  .then(() => {
     $.ajax({
      type: 'delete',
      url: '/deleteOrder',
      data:{
        productyId: productId
      }
    }).then(() => {
      window.location.reload();
    }).catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    return console.log(err);
  })
}

function Mypage(){
  let [productData,setData] = useState();
  useEffect(() => {
    $.ajax({
      type: 'get',
      url : '/userInfo'
    }).done((data) => {
      setData(data);
    }).fail((err) => {
      alert(err.responseJSON.message);
      const a = document.createElement('a');
      a.setAttribute('href','Sign_in');
      a.click();
      return err
    })
  },[])
  return(
    <>
    {productData && 
      <LoginHeader/>
    }
    {
      productData &&
      <ProductDataCom productData={productData}/>
    }
    </>
  )
}

function ProductDataCom(props){
  //삭제요청시 해당 상품의 id와 상품이 몇번째 상품인지 확인하기 위함
  let [state,setState] = useState(false);
  let [productId,setId] = useState(0);
  return(
    <>
      <h2 className="mypage-title">주문처리 현황</h2>
      <div className="orderState">
        <div>
          입금전
          <span>{props.productData.productId.length}</span>
        </div>
        <div>
          입금완료
          <span>{props.productData.buyList.length}</span>
        </div>
        <div>
          배송중
          <span>0</span>
        </div>
      </div>
      <div className="mypageOrderList">
        <h2>나의 주문내역</h2>
        <table>
          <thead>
            <tr>
              <th>이미지</th>
              <th>상품명</th>
              <th>가격</th>
              <th>주문수량</th>
              <th>주문취소</th>
            </tr>
          </thead>
          {
          props.productData.buyList.map((e) => {
            let price = parseInt(e.price);
            let calc = price * e.qua;
            let changeString = calc.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            return(
              <>
                <tr>
                  <td>
                    <div className="mg_imgBx">
                      <img src={`${e.img}`} alt="상품이미지" />
                    </div>
                  </td>
                  <td>{ e.productName }</td>
                  <td>{ changeString }원</td>
                  <td>{ e.qua }</td>
                  <td>
                    <button className="deleteBtn" onClick={() => {
                      setState(true);
                      setId(e.id);
                    }}>X</button>
                  </td>
                </tr>
              </>
            )
          })
        }
        </table>
      </div>
      {
        state === true ? <Confirm setState={setState} productId={productId} productData={props.productData}/> : null
      }
    </>
  )
}


function Confirm(props){
  return(
    <div className="mg_background">
      <div className="mg_conFirm">
        정말 해당 상품 구매를 취소 하시겠습니까?
        <div className="cf_btnArea">
          <button onClick={() => {
            cancleOrder(props.productId,props.productData);
            props.setState(false);
          }}>구매취소</button>
          <button onClick={() => {
            props.setState(false);
          }}>뒤로가기</button>
        </div>
      </div>
    </div>
  )
}

export default Mypage;