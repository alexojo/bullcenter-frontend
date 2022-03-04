import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Redirect
  } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { PublicRoute } from './PublicRoute';
import { DashboardRouter} from './DashboardRouter';
import { PrivateRoute } from './PrivateRoute';
import { LoginScreen } from '../components/login/LoginScreen';
import { selectUser } from '../reducers/authReducer';
//import { signin, autenticacion, estaAutenticado } from '../components/api/apiCore'

export const AppRouter = () => {

  const dispatch = useDispatch();
  const [ isLoggedIn, setIsLoggedIn ] = useState( true );
  const user = useSelector( selectUser );

  //const jwt = JSON.parse(localStorage.getItem("jwt"));
  

  useEffect(() => {

    /*if(estaAutenticado()){
      setIsLoggedIn(true);     

    }
    else{
      
      if(user?.user){
        const dni = user.user.dni;
        const contrasenia = user.user.contrasenia;
        signin({dni, contrasenia})
        .then(data => {
          if (data.error){
            setIsLoggedIn(false);
          } else {
            autenticacion(data);
            setIsLoggedIn(true);
          }
        })}
      else{
        setIsLoggedIn(false);
      }

    }*/

    
}, [dispatch, setIsLoggedIn, user])


  return (
    <Router>
      <div >
        
          <Switch>

            <PublicRoute
              exact
              path = "/login"
              component = { LoginScreen }
              isAuthenticated={ isLoggedIn }
            />


            <PrivateRoute           
              path = "/"
              component = { DashboardRouter }
              isAuthenticated={ isLoggedIn }
            />

            <Redirect to = "/login"/>

          </Switch>
        
      </div>
    </Router>
  )
}