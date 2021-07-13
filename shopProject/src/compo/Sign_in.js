import '../css/Sign_in.css';
import Header from './Header';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import jquery from 'jquery';
window.$ = window.jquery = jquery;

function checkEnter(e){
  if(e.key == 'Enter'){
    checkForms();
  }else{
    return;
  }
}

function checkForms(){
  let form = document.querySelectorAll('input');
  const regular_expression = /^[A-Za-z0-9]{6,12}$/;
  let regex = / /gi;

  for(let i =0; i < form.length; i++){
    let formSelect = document.querySelectorAll('input')[i];
    if(formSelect.value === ''){
      alert('정보가 입력되지 않았습니다.');
      break;
    }else if( regex.test(formSelect.value) === true ){
      alert('띄어쓰기 없이 입력해 주십시오');
      break;
    }else if(!regular_expression.test(form[1].value)){
      alert('비밀번호를 형식에 맞게 입력해주십시오');
      break;
    }
  }
  $.ajax({
    url : '/Sign_in',
    method: "POST",
    data : {
      id : form[0].value,
      pw : form[1].value,
    }
  }).then(() => {
    let Link = document.createElement('a');
    Link.setAttribute('href','/Login');
    Link.click();
  }).catch((data) => {
    alert(data.responseJSON.message);
  })
}

function Sign_in(){
  return(
    <>
      <Header/>
      <div className="login_form">
        <h2>Login</h2>
        <form action="/Sign_in" method="post" className="signInForm">
          <input type="email" name="id" placeholder="이메일" className="loginInput"/>
          <input type="password" name="pw" placeholder="기본 숫자와 문자로만 이루어진 6~12자리의 비밀번호" className="loginInput" onKeyPress={checkEnter}/>
          <button  onSubmit={checkForms} className="button" onKeyPress={checkEnter}>로그인하기</button>
          <button className="button"><Link to="/">취소</Link></button>
        </form>
      </div>
    </>
  )
}
export default Sign_in