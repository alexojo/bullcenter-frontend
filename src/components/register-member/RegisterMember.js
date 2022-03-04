import React, {useState} from 'react'
import { useForm } from '../../hooks/useForm';
import { Input } from '../components/Input'
import { LoadImage } from '../components/LoadImage';
import { crearMiembro } from '../api/apiCore'

import Swal from 'sweetalert2';

export const RegisterMember = () => {

    const [ formValues, handleInputChange, setValues ] = useForm({
        nombre: '',
        dni: '',
        peso: '',
        celular:''
    });
    
    //-----------------------------------------------------------------------
    const [fileUrl, setFileUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

    function processImage(event){
        const imageFile = event.target.files[0];
        console.log(imageFile)
        const imageUrl = URL.createObjectURL(imageFile);
        setFileUrl(imageUrl)
    }
    
    const { nombre, dni, peso, celular } = formValues;

    //-----------------------------------------------------------------------
    const handleRegisterMember = (e) => {
        e.preventDefault();
        crearMiembro(formValues).then(response =>{
            Swal.fire('Success', 'El usuario se registro exitosamente', 'success');

            setValues({
                ...formValues,
                nombre : '',
                dni : '',
                peso: '',
                celular:''   
            });
        })
        .catch(err =>{
            Swal.fire('Error', 'Revise que no hayan espacios vacíos y que el usuario no este registrado anteriormente', 'error');
        })
    }

    return (
        <>
            <div className = "register-member__title">
                REGISTRAR MIEMBRO
            </div>
            
            <div className = "register-member__dash-container">

                <div className = "register-member__box-container">
                    

                    <div className = "register-member__form">

                        <div className = "register-inputs__form">

                            <Input
                                autocomplete = "off"
                                name = "dni"
                                type = "text"
                                text = "DNI"
                                placeholder = "Ingrese número de DNI"
                                minlength = "8" 
                                maxlength = "8"
                                autofocus = "autofocus"
                                value = { dni }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                autocomplete = "off"
                                name = "nombre"
                                type = "text"
                                text = "nombre"
                                placeholder = "Ingrese nombre completo"
                                value = { nombre }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                autocomplete = "off"
                                name = "peso"
                                type = "number"
                                text = "peso"
                                placeholder = "Ingrese peso en kg"
                                value = { peso }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                autocomplete = "off"
                                name = "celular"
                                type = "text"
                                text = "celular"
                                placeholder = "Ingrese numero de celular"
                                value = { celular }
                                onChange = { handleInputChange  } 
                            />

                        </div>               
                    </div>
                    <div className = "register-member__image">

                        <LoadImage 
                            name = "foto"
                            value = { fileUrl }
                            onChange = { processImage  }          
                        />

                    </div>
                    
                </div>

            </div>

            <div className = "register-member__button">

                <button className = "register-member-component__button"  onClick = {handleRegisterMember}>Registrar Miembro</button>
                
            </div>
        </>

    )
}
