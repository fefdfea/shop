import '../css/detail.css';
import {useParams} from 'react-router-dom';
import $ from 'jquery';
import jquery from 'jquery';
import { Link } from 'react-router-dom';
window.$ = window.jquery = jquery;
let IMP = window.IMP;
IMP.init('imp00862712');


function buy(item){
  //결제창 호출 함수
  $.ajax({
    type: 'get',
    url: '/UserInfo'
  })
  .then((data) => {
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
    merchant_uid: 'merchant_' + new Date().getTime(),
    name: item.productName,
    //결제창에서 보여질 이름
    amount: item.price,
    //가격
    buyer_email: data.id,
    buyer_name: '김창규',
    buyer_tel: data.phone,
    buyer_addr: '서울특별시 강남구 삼성동',
    buyer_postcode: '123-456',
    m_redirect_url: 'https://www.yourdomain.com/payments/complete'
    /*
    모바일 결제시,
    결제가 끝나고 랜딩되는 URL을 지정
    (카카오페이, 페이코, 다날의 경우는 필요없음. PC와 마찬가지로 callback함수로 결과가 떨어짐)
    */
    }, function (rsp) {
    if (rsp.success) {
    const a = document.createElement('a');
    a.setAttribute('href','/Mypage');
    a.click();
    } else {
    var msg = '결제에 실패하였습니다.';
    msg += '에러내용 : ' + rsp.error_msg;
    }
    alert(msg);
    });
  })
  .catch((err) => {
    alert(err.responseJSON.message);
    const a = document.createElement('a');
    a.setAttribute('href','/Sign_in');
    a.click();
  })
}


//장바구니 추가를 누르면 서버로 id값을넘김(서버에서 상품 정보를 찾음)
  function addlist(id) {
    $.ajax({
      type: 'post',
      url: '/add_list',
      data:{
        params: id ,
      }
    })
    .then(() => {
      const a = document.createElement('a');
      a.setAttribute('href','/Login');
      a.click();
    })
    .catch((err) => { 
      alert(err.responseJSON.message);
      const a = document.createElement('a');
      a.setAttribute('href','/Sign_in');
      a.click();
     })
  }

  function Detail(props) {
    let { id } = useParams();
    let shopdata = [...props.shop];
    let found = shopdata.find(e => {
      return e.id == id;
    });
    console.log(props.loginState);
  return ( 
  <>
  {
    
  }
    <div className = "product" >
      <div className = "productImg" >
        <img src = {`${found.img}`} alt = "상품이미지"/>
      </div> 
      <div className = "desc" >
          <h2> 상품명: {found.productName} </h2> 
        <div className = "productDesc">
          <p> 상품요약정보: <span> 입력 </span></p>
          <p> 판매가: <span> {found.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원 </span></p>
        </div> <div className = "btn-area" >
        <button className = "detail_btn" onClick={() => {buy(found)}}> 구매하기 </button>
        <button onClick = {(() => {addlist(id)})} className = "detail_btn" > 장바구니 담기 </button>
        <button className="detail_btn"><Link to="/">메인으로</Link></button>
        </div> 
      </div>
    </div> 
  </>
  )
}

export default Detail;