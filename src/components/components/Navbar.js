import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../reducers/authReducer';
import {signout} from '../api/apiCore'

export const Navbar = () => {

    const dispatch = useDispatch();
    const user = useSelector( selectUser );

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        signout();
    }
    return (
        <nav className="navbar">
                
            <div className = "navbar-image">
                <img src="https://1.bp.blogspot.com/-vhmWFWO2r8U/YLjr2A57toI/AAAAAAAACO4/0GBonlEZPmAiQW4uvkCTm5LvlJVd_-l_wCNcBGAsYHQ/s16000/team-1-2.jpg" alt="profile_picture"/>
                { ( user?.user ) 
                                && <p className='navbar-name'>{user.user.nombre}</p> }
            </div>
            
            <div className="navbar-collapse">
                <div className="navbar-collapse-1">
                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/menu"
                    >
                        <span className="icon"><i className="fas fa-server"></i></span>
                        Resumen
                    </NavLink>
                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/hoy"
                    >
                        <span className="icon"><i className="fas fa-server"></i></span>
                        Resumen de Hoy
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/attendance"
                    >
                        <span className="icon"><i className="fas fa-portrait"></i></span>
                        Registrar Asistencia
                    </NavLink>

                    

                    {/* 
                    
                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/register-member"
                    >
                        <span className="icon"><i className="fas fa-user"></i></span>
                        Registrar Miembro
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/edit-member"
                    >
                        <span className="icon"><i className="fas fa-user-edit"></i></span>
                        Editar a Miembro
                    </NavLink> */}

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/matriculas"
                    >
                        <span className="icon"><i className="fas fa-user-edit"></i></span>
                        Matriculas
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/members"
                    >
                        <span className="icon"><i className="fas fa-user-edit"></i></span>
                        Miembros
                    </NavLink>

                </div>
                <div className="navbar-collapse-1">
                    <button
                            className="nav-item-logout"
                            onClick={ handleLogout }
                    > 
                        <span className="icon"><i className="fas fa-sign-out-alt"></i></span>
                        Salir
                    </button>
                </div>
                

                
                
            </div>
        </nav>
    )
}
