const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongodb = require('mongodb').MongoClient;
require('dotenv').config();
const { model } = require('./Model/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const axios = require('axios');
let db;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('shopProject/build'));
app.use(cookie());

mongodb.connect(process.env.DB_URL,{ useUnifiedTopology: true },function(err,client){
  if(err) return err;
  console.log('db서버 연결');
  db = client.db('to-do-app');
})

mongoose.connect(process.env.DB_URL,{
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex:true
})
.then(() => {console.log('db 연결')})
.catch(() => {});

app.listen(process.env.PORT,function(){
  console.log(`${process.env.PORT}포트 연결`)
})

//get 요청

app.get('/',function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

app.get('/detail/:id',function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

app.get('/Sign_up',function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});


app.get('/Sign_in',function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});


app.get('/My_Page',function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

app.get('/Login',auth,function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

app.get('/Order_List',auth,function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

app.get('/Mypage',auth,function(req,rsp){
  rsp.sendFile(__dirname + '/shopProject/build/index.html');
});

//유저정보를 돌려주는 api
app.get('/userInfo',function(req,rsp){
  let cookie = req.cookies.acc;
  if(!cookie) return rsp.status(400).send({ message: '로그인해 주십시오' });
  jwt.verify(cookie,process.env.SECRET_KEY,function(err,decoded){
    if(err) return rsp.status(400).send({ message: '요청 실패' });
    model.findOne({ id: decoded },function(err,result){
      if(err) return rsp.status(400).send({ message: '요청 실패' });
      return rsp.status(200).send(result);
    });
  });
});


app.get('/infoLoad',function(req,rsp){
  db.collection('img').find().toArray(function(err,result){
    if(err) return rsp.status(400).send({ message: '요청에 실패했습니다'});
    if(result){
      return rsp.status(200).send(result);
    }
  });
 });
//장바구니의 상품 갯수를 보내주는 api
app.get('/cart_list_info',function(req,rsp){
  const Token = req.cookies.acc;
  jwt.verify(Token,process.env.SECRET_KEY,function(err,decoded){
    if(err) return rsp.status(400).send({ message: '로그인해 주십시오' });
    //토큰의 정보를 이용하여 유저정보의 상품 id를 가져옴
    model.findOne({ id:decoded },function(err,result){
      if(err) return rsp.status(400).send({ message: '장바구니 갯수를 불러오지 못했습니다' })
      if(!result){
        return rsp.status(400).send({ message: '결과가 존재하지 않습니다' })
      }
      if(result){
        rsp.status(200).send(result);
      }
      
    })
  })
});

//로그아웃 api
app.get('/logout',function(req,rsp){
  //쿠키가 존재할시 
  if( rsp.clearCookie('acc') ){
    rsp.clearCookie('acc').status(200).send({ message : '로그아웃 완료' });
  }else{
    rsp.status(400).send({ message : '로그인되어 있지 않습니다' });
  }
});

 //post 요청
//크립토 라이브러리를 이용하여 비밀번호를 암호화 하여 보관함
 app.post('/Sign_up',function(req,rsp){
   //전화번호 하이폰 적용
   req.body.phone = req.body.phone.toString().replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3")
   model.findOne({ id: req.body.id },function(err,result){
     if(err) rsp.status(400).send({ message: '회원가입에 실패했습니다.' })
     if(result){
        return rsp.status(400).send({ message: '이미 존재하는 아이디 입니다.' })
      }
     if(!result){
      crypto.randomBytes(64, (err, buf) => {
        if(err) rsp.status(400).send({ message: '회원가입에 실패했습니다.' })
        crypto.pbkdf2(req.body.pw, buf.toString('base64'), 123121, 64, 'sha512', (err, key) => {
          if(err) rsp.status(400).send({ message: '암호화에 실패했습니다.' })
          const user = new model({
            _id: new mongoose.Types.ObjectId(),
            id: req.body.id,
            pw: key.toString('base64'),
            name : req.body.name,
            phone: req.body.phone,
            salt: buf.toString('base64'),
          });
          user.save()
          .then(() => { 
            return rsp.status(200).send({ message: '회원가입에 성공했습니다.' })
          })
          .catch((err) => { 
            return rsp.status(400).send({ messgae: '가입에 실패했습니다 다시 시도해 주십시오',error: err })
          })
        });
      });
     }
   })
 });
//로그인 api
app.post('/Sign_in',function(req,rsp){
  model.findOne({ id: req.body.id },function(err,result){
    if(err) return rsp.status(400).send({ message: '로그인에 실패했습니다.' })
    if(!result){
      return rsp.status(400).send({ messgae: '아이디를 찾을 수 없습니다' })
    }
    if(result){
      crypto.pbkdf2(req.body.pw, result.salt, 123121, 64, 'sha512', (err, key) => {
        if(err) return rsp.status(400).send({message : '로그인에 실패했습니다.'});
        if(result.pw == key.toString('base64')){
          const usertoken = jwt.sign(req.body.id,process.env.SECRET_KEY);
          rsp.cookie('acc',usertoken,{
            httpOnly: true
          });
        }
        return rsp.status(200);
      })
    }
  })
});
//쿠키의 아이디 정보를 이용하여 유저를 찾고 그 정보에 상품 아이디를 추가함
app.post('/add_list',function(req,rsp){
  req.body.params = parseInt(req.body.params)
  const Token = req.cookies.acc
  //jwt 복호화
  jwt.verify(Token,process.env.SECRET_KEY,function(err,decoded){
    if(err) return rsp.status(400).send({ message: '로그인해 주십시오' });
    //상품목록에서 요청한 아이디로 상품을 찾음
    db.collection('img').findOne({ id: req.body.params },function(err,result){
      if(err) rsp.status(400).send({ message:'상품정보 요청에 실패 했습니다.' })
      if(!result){
        return rsp.status(400).send({ message: '상품을 찾을 수 없습니다' });
      }
      if(result){
        //중복 데이터를 없애기 위한 addToset을 이용
        model.updateOne({id: decoded},{ $addToSet: {productId : result}},function(err,result){
        if(err) return rsp.status(400).send({ message: '요청에 실패했습니다' })
        return rsp.status(200).send({ message: '저장완료' });
    })  
      }
    })
  });
});
//환불요청
app.post('/payments/cancel', async (req, res) => {
  try {
    const Token = req.body.acc;
        /* 액세스 토큰(access token) 발급 */
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { 
        "Content-Type": "application/json" 
      },
      data: {
        imp_key: "imp_apikey", // [아임포트 관리자] REST API키
        imp_secret: "ekKoeW8RyKuT0zgaZsUtXXTLQ4AhPFW3ZGseDA6bkA5lamv9OqDMnxyeB9wqOsuO9W3Mx9YSJ4dTqJ3f" // [아임포트 관리자] REST API Secret
      }
    });
    const { access_token } = getToken.data.response; // 엑세스 토큰
   /* 아임포트 REST API로 결제환불 요청 */
    const getCancelData = await axios({
      url: "https://api.iamport.kr/payments/cancel",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": access_token // 아임포트 서버로부터 발급받은 엑세스 토큰
      },
      data: {
        reason : req.body.reason,   // 가맹점 클라이언트로부터 받은 환불사유
        imp_uid : req.body.merchant_uid // imp_uid를 환불 고유번호로 입력
      }
    })
    const { response } = getCancelData.data; // 환불 결과

    rsp.status(200).send({ message: '환불에 성공했습니다.', result: response });
    /* 환불 결과 동기화 */
  } catch (error) {
    return res.status(400).send({ message: '실패' , errorMs : error});
  }
});

//delete 요청

app.delete('/deleteOrder',function(req,rsp){
  req.body.productyId = parseInt(req.body.productyId);
  const Token = req.cookies.acc;
  jwt.verify(Token,process.env.SECRET_KEY,function(err,decoded){
    if(err) return rsp.status(400).send({message: '로그인 해주십시오'});
    req.body.produtyId = parseInt(req.body.productyId);
    model.updateOne({ id: decoded },{ $pull: {buyList: { id: req.body.productyId } } },function(err,result){
      if(err) return rsp.status(400).send({message: '상품을 찾지 못했습니다.'});
      rsp.status(200).send('성공');
    });
  });
});

//put 요청

 /* 결제가 완료되면 전송된 데이터를 새로운 array에 넣고 기존 array의 데이터는 전부 제거 */
app.put('/successBuy',function(req,rsp){
  const Token = req.cookies.acc;
  jwt.verify(Token,process.env.SECRET_KEY,function(err,decoded){
    if(err) rsp.status(400).send({ message: '사용자 인증에 실패했습니다.' });
      if(err) return rsp.status(400).send({ message: '실패' });
      console.log(req.body.cartList);
      //req로 받은 장바구니의 상품들을 buyList로 다시 옮김
      model.updateOne({ id: decoded },{$push: {buyList : req.body.cartList} },function(err,result){
        if(err) return rsp.status(400).send({ message: '옮기는중 오류가 발생 하였습니다.' })
      });

      // 반복문을 이용하여 장바구니 상품 삭제 
      for(let i = 0; i < req.body.cartList.length; i++){
        req.body.cartList[i].id = parseInt(req.body.cartList[i].id);
        model.updateOne({ id: decoded },{ $pull: {  productId: {id : req.body.cartList[i].id} }},function(err,result){
          if(err) return rsp.status(400).send({ message: '장바구니 목록 제거 실패' });
        });
      }
  });
});

app.delete('/delete',function(req,rsp){
  const Token = req.cookies.acc;
  req.body.id = parseInt(req.body.id);
  jwt.verify(Token,process.env.SECRET_KEY,function(err,decoded){
    if( err ) return rsp.status(400).send({ message: '정보를 확인 할 수 없습니다.' });
    model.updateOne({ id: decoded },{ $pull: {productId : {id : req.body.id} } },function(err,result){
      if(err) return rsp.status(400).send({ message: '상품을 찾을 수 없거나 존재하지 않는 사용자입니다.' });
      return rsp.status(200).send({ message: '성공' });
    });
    });
  });


//쿠키를 가져오고 토큰을 복호화햐여 저장된 id와 저장소의 id 비교후 맞으면 next
function auth(req,rsp,next){
  let token = req.cookies['acc'];
  if(!token){
    return rsp.status(400).send({ message: '로그인해 주십시오' });
  }
  let decoded = jwt.verify(token,process.env.SECRET_KEY);
  model.findOne({ id: decoded },function(err,result){
    if(err) return rsp.status(400).send({ message: '요청에 실패했습니다' });
    if(!result){
      return rsp.status(400).send({ message: '존재하지 않는 아이디입니다' });
    }
    if(result){
      next()
    }
  })
}