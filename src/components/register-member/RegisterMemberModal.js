import { Dialog } from '@material-ui/core';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { useForm } from '../../hooks/useForm';
import { crearMiembro } from '../api/apiCore';
import { InputModal, InputSearchModal } from '../components/InputModal';

export const RegisterMemberModal = ({setOpen, open}) => {

    const [ formValues, handleInputChange, setValues ] = useForm({
        nombre: '',
        dni: '',
        peso: '',
        celular:''
    });

    const { nombre, dni, peso, celular } = formValues;

    const [cargando, setCargando] = useState(false)

    
    const handleRegisterMember = (  ) => {
        const formValuesAux = {nombre: nombre, dni: dni, peso: 0, celular: celular}
        crearMiembro(formValuesAux).then(response =>{
            Swal.fire('Success', 'El usuario se registro exitosamente', 'success');
            setOpen(false);
        })
        .catch(err =>{
            Swal.fire('Error', 'Revise que no hayan espacios vacíos y que el usuario no este registrado anteriormente', 'error');
        })
    } 

    const handleSearchDni = async (e) => {
        e.preventDefault();
        setCargando(true)
        if(dni.length === 8){
            
            const resp = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNlY3RvcjMzQG91dGxvb2suZXMifQ.DGLuRH7lScTxkvXJm1ZqiV8ss4iTDHBRkBEbPqO8R08`)
            const body = await resp.json();
                     
            if(body.dni){

                const nombreBody = `${body.nombres} ${body.apellidoPaterno} ${body.apellidoMaterno}`;

                setValues({
                    ...formValues,
                    nombre: nombreBody,
                    peso: '',
                    celular:'' 
                });
            }
            else{
                Swal.fire('Error', 'El DNI no existe', 'error');
                setValues({
                    ...formValues,
                    dni:'',
                    nombre: '',
                    peso: '',
                    celular:'' 
                });
            }
        }
        else{
            Swal.fire('Error', 'El DNI debe tener 8 dígitos', 'error');
            setValues({
                ...formValues,
                dni:'',
                nombre: '',
                peso: '',
                celular:'' 
            });
        }
        setCargando(false)
    }

    const handleClose = () => {
        setOpen(false);
      };

    return (
        <Dialog 
            selectedValue={open}
            open={open}
            onClose={handleClose}>
                <div className="centered">
                    <div className="modal">

                    <div className="modalHeader">
                        <h5 className="heading">REGISTRAR MIEMBRO</h5>
                    </div>

                    <div className= "modalContent">

                        <InputSearchModal
                            autocomplete = "off"
                            text = "DNI"
                            name = "dni"
                            placeholder = "Buscar o ingresar dni"
                            minlength = "8" 
                            maxlength = "8"
                            value = { dni }
                            onChange = { handleInputChange  }
                            autofocus = "autofocus"  
                            handleSearchDni = { handleSearchDni }           
                        />
                        { cargando && <p className='cargando'>Cargando datos...</p>}
                        <form>
                            
                            <InputModal
                                autocomplete = "off"
                                name = "nombre"
                                type = "text"
                                text = "nombre"          
                                value = { nombre }
                                onChange = { handleInputChange  } 
                            /> 
                            <InputModal
                                autocomplete = "off"
                                name = "celular"
                                type = "text"
                                text = "celular"         
                                value = { celular }
                                onChange = { handleInputChange  } 
                                
                            />                      
                        </form>
                        <p className='comentario'>Deberá llenar manualmente el 'Nombre' si el usuario no tiene DNI válido al hacer la búsqueda 🔎</p>
                    </div>

                   
                    
                    <div className= "modalActions">
                        <div className= "actionsContainer">
                            <button className=" deleteBtn" onClick={() => {handleRegisterMember()}}>
                                Registrar
                            </button>
                            <button
                                className= "cancelBtn"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
        </Dialog>
    )
}
