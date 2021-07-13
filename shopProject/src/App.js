import React, { useEffect,useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Main from './compo/Main';
import Detail from './compo/Detail.js';
import Sign_up from './compo/Sign_up';
import Sign_in from './compo/Sign_in';
import OrderList from './compo/OrderList';
import Login from './compo/Login';
import Mypage from './compo/Mypage';
import axios from 'axios';

function App() {
  let [shopdata,setdata] = useState();
  let [productQuntity,setproductQuntity] = useState();
  useEffect(() => {
    axios.get('/infoLoad')
    .then((response) => {
      setdata(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
  },[])
  return (
    <div className="App">
      <div className="container">
        <Switch>
          
          <Route path="/Sign_up">
            <Sign_up/>
          </Route>

          <Route path="/Sign_in">
            <Sign_in/>
          </Route>

          <Route path="/Login">
            {shopdata && 
              <Login shop={shopdata}/>
            }
          </Route>
          
          <Route path="/Order_list">
              <OrderList productQuntity={productQuntity} setproductQuntity={setproductQuntity}/>
          </Route>

          <Route path="/detail/:id">
            {shopdata && 
              <Detail shop={shopdata}/>
            }
          </Route>
          <Route path="/Mypage">
            {shopdata && 
              <Mypage shop={shopdata}/>
            }
          </Route>

          <Route path="/">
            {shopdata && 
              <Main shop={shopdata}/>
            }
          </Route>

        </Switch>
      </div>
    </div>
  );
}

export default App;