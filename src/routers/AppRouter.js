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
import { login, selectUser } from '../reducers/authReducer';
import { signin, autenticacion, estaAutenticado } from '../components/api/apiCore'

export const AppRouter = () => {

  const dispatch = useDispatch();
  const [ isLoggedIn, setIsLoggedIn ] = useState( true );
  const user = useSelector( selectUser );

  if(JSON.parse(localStorage.getItem("jwt")) && user.user === null){
    const jwt = JSON.parse(localStorage.getItem("jwt")).usuario;

    dispatch( login({
      dni: jwt.dni,
      contrasenia: jwt.contrasenia,
      nombre: jwt.nombre
  }));
  }

  useEffect(() => {
    
    if(estaAutenticado()){
      
      setIsLoggedIn(true);
    }
    else{
      if(user?.user){
        setIsLoggedIn(true);
      }
      else{
        setIsLoggedIn(false);
      }

    }

    
}, [user])


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