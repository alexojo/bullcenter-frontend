import React, { useContext } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../reducers/authReducer';
import {signout} from '../api/apiCore'

export const Navbar = () => {

    const dispatch = useDispatch();

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        signout();
    }
    return (
        <nav className="navbar">
                
            <div className = "navbar-image">
                <img src="https://1.bp.blogspot.com/-vhmWFWO2r8U/YLjr2A57toI/AAAAAAAACO4/0GBonlEZPmAiQW4uvkCTm5LvlJVd_-l_wCNcBGAsYHQ/s16000/team-1-2.jpg" alt="profile_picture"/>
            </div>
            
            <div className="navbar-collapse">
                <div className="navbar-collapse-1">
                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/menu"
                    >
                        <span class="icon"><i class="fas fa-server"></i></span>
                        Resumen
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/attendance"
                    >
                        <span class="icon"><i class="fas fa-portrait"></i></span>
                        Registrar Asistencia
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/register-matricula"
                    >
                        <span class="icon"><i class="fas fa-address-card"></i></span>
                        Registrar Matrícula
                    </NavLink>
                    
                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/register-member"
                    >
                        <span class="icon"><i class="fas fa-user"></i></span>
                        Registrar Miembro
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/edit-member"
                    >
                        <span class="icon"><i class="fas fa-user-edit"></i></span>
                        Editar a Miembro
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/matriculas"
                    >
                        <span class="icon"><i class="fas fa-user-edit"></i></span>
                        Matriculas
                    </NavLink>

                    <NavLink 
                        activeClassName="active"
                        className="nav-item" 
                        exact
                        to="/members"
                    >
                        <span class="icon"><i class="fas fa-user-edit"></i></span>
                        Miembros
                    </NavLink>

                </div>
                <div className="navbar-collapse-1">
                    <button
                            className="nav-item-logout"
                            onClick={ handleLogout }
                    > 
                        <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
                        Logout
                    </button>
                </div>
                

                
                
            </div>
        </nav>
    )
}
