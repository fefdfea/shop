import '../css/Sign_up.css';
import { Link } from 'react-router-dom';
import Header from './Header';
function checkForm(){
  const regular_expression = /^[A-Za-z0-9]{6,12}$/; //숫자와 문자로만 이루어지 6~12자리 비밀번호 정규식
  const regular_name = /[0-9]/g;
  const regular_blank = /\s/g;
  const input = document.querySelectorAll('input');
  const pw = document.getElementById('pw').value;
  const pwCheck = document.getElementById('pwCheck').value;
  const userName = document.querySelector('#name').value;
  for(let i =0; i < input.length; i++){
    if(input[i].value === ""){
      alert('정보를 입력해 주십시오');
      return -1;
    }
    else if(regular_blank.test(input[i].value)){
      alert('정보칸에 공백이 존재합니다');
      return -1; 
    }
  }
  if(!regular_expression.test(pw)){
    alert('비밀번호를 형식에 맞게 작성해 주십시오');
    return -1;
  }
  else if(!pw === pwCheck){
    alert('비밀번호가 다릅니다');
    return -1;
  }
  else if( regular_name.test(userName) ){
    userName.replace(regular_name,"");
    alert('이름칸에는 문자만 입력이 가능합니다');
    return -1;
  }
  return 1;
}
//엔터키를 눌러 submit 되었을때를 대비함
window.addEventListener('submit',function(e){
  const state = checkForm();
  if( state === -1 ){
    e.preventDefault();
  }
});

function checkPhoneNumber(e){
  const code = e.keyCode;
  //숫자, 엔터, 백스페이스만을 허용함
  if((code > 47 && code < 58 || code === 8 || code === 13)){
    return;
  } 
  alert('숫자만 입력해 주십시오');
  e.preventDefault();
  return false;
}

function Sign_up() {
  return(
    <>
      <Header/>
    <div>
      <h2 className="join">Join Us</h2>
      <div className="Sign_up">
        <form action="/Sign_up" method="post" className="form">
          <div className="form-container">
            <div className="input">
              <ul>
                <li><input type="email" name="id" placeholder="이메일" id="email"/></li>
                <li><input type="password" name="pw" id="pw"  placeholder="기본 숫자와 문자로만 이루어진 6~12자리의 비밀번호"/></li>
                <li><input type="password" id="pwCheck" placeholder="비밀번호 확인"/></li>
                <li><input type="text" name="name" placeholder="사용자의 이름" id="name"/></li>
                <li>
                  <input type="text" onKeyDown={checkPhoneNumber} name="phone" maxLength="11" id="phone" placeholder="-제외한 휴대폰번호를 입력해 주십시오" id="phone"/>
                </li>
              </ul>
            </div>
          </div>
          <div className="btn-area">
            <button type="submit" className="button" onClick={checkForm}>회원가입</button>
            <button type="button" className="button"><Link to="/">취소</Link></button>
          </div>
        </form>
      </div>
    </div>
  </>
  )
}


export default Sign_up;