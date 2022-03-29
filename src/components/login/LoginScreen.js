import React, {useState} from 'react'
import { signin, autenticacion, read } from '../api/apiCore'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { login} from '../../reducers/authReducer';
import { start_loading, finish_loading, selectLoading } from '../../reducers/loadingReducer';

import Swal from 'sweetalert2';


export const LoginScreen = () => {

    const dispatch = useDispatch();

    const [passwordShown, setPassword] = useState(false);
    const loading = useSelector( selectLoading );


    const togglePassword = () => {
        setPassword(passwordShown ? false : true);
    };
    
    const [ formValues, handleInputChange ] = useForm({
        dni: '',
        contrasenia: ''
    });

    const { dni, contrasenia } = formValues;

    //------------------

    const handleLogin = (e) => {
        e.preventDefault();

        dispatch( start_loading() );

        signin({dni, contrasenia})
        .then(response =>{
            
            if (response.error){
                Swal.fire('Error', 'El usuario no existe', 'error');
                dispatch( finish_loading() );
            } else {
                autenticacion(response);
                //-- BUSCAR DNI
                read(dni)
                .then(response => {

                    dispatch( login({
                        dni: dni,
                        contrasenia: contrasenia,
                        nombre: response.nombre
                    }));
                })
                dispatch( finish_loading() );
                
            }
            
        })
        .catch(err =>{Swal.fire('Error', 'El usuario no existe', 'error');})

        
    }

    return (
        <div className = "auth__main-flayer">
            <div className = "auth__main">
                <div className = "auth__box-container">
                    <div className = "content__t<itle">
                        <h3 className="auth__title">¡BIENVENIDO!</h3>
                    </div>
                    <form>
                        <div className = "content__label">
                            <label className="label__login">Usuario</label>
                        </div>
                        <input 
                            type="text"
                            placeholder="DNI"
                            name="dni"
                            className="auth__input"
                            autoComplete="on"
                            value={ dni }
                            minlength="8" 
                            maxlength="8"   
                            onChange = { handleInputChange  } 
                                 
                        />
                        <div className = "content__label">
                            <label className="label__login">Contraseña</label>
                        </div>
                        <div className="input__password">
                            <input 
                                type= { passwordShown ? "text" : "password" } 
                                placeholder="Contraseña"
                                name="contrasenia"
                                className="auth__input"
                                value={ contrasenia }
                                onChange = { handleInputChange }
                            />
                            <i onClick={togglePassword} className={ passwordShown ? "fas fa-eye" : "fas fa-eye-slash" }></i>
                        </div>
                        <button
                            type="submit"
                            className="btn__login"
                            onClick = { handleLogin }            
                        >
                            Ingresar
                        </button>

                        {
                            ( loading.loading ) 
                                && <p className="cargando__login"> Cargando... </p>
                        }
                    </form>
                </div>
            </div>
        </div>
    )
}