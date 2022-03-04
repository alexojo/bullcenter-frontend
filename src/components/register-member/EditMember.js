
import React, {useState} from 'react';
import { Input } from '../components/Input';
import { useForm } from '../../hooks/useForm';
import { LoadImage } from '../components/LoadImage';
import { Search } from '../components/Search';
import { read, actualizarMiembro } from '../api/apiCore';

import Swal from 'sweetalert2';

export const EditMember = () => {

    const [ formValues, handleInputChange, setValues ] = useForm({
        nombre: '',
        dni: '',
        peso: 0,
        celular:'',
        buscardni:'',
        fechaInicio:"2021-01-01"
    });

    const { dni, nombre, peso, celular, buscardni, fechaInicio, fechaVencimiento } = formValues;

    const handleSearchDni = (e) => {
        e.preventDefault();
        console.log(buscardni);
        read(buscardni)
        .then(response => {
            if (response.error){
                console.log("pipi")
                Swal.fire('Error', 'El usuario no existe', 'error');
            } else {
                console.log("aea")
                setValues({
                ...formValues,
                nombre : response.nombre,
                dni : response.dni,
                peso: response.peso,
                celular: response.celular                
                });
            }
        })
        .catch(err => {
            Swal.fire('Error', 'El usuario no existe', 'error');
            
        })
            
    }

    //-----------------------------------------------------------------------
    const [fileUrl, setFileUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');

    function processImage(event){
        const imageFile = event.target.files[0];
        console.log(imageFile)
        const imageUrl = URL.createObjectURL(imageFile);
        setFileUrl(imageUrl)
     }
    
    const handleEditMember = (e) => {
        e.preventDefault();
        actualizarMiembro(formValues,buscardni).then(response =>{
            Swal.fire('Success', 'El usuario se actualizó exitosamente', 'success');
            setValues({
                ...formValues,
                nombre: '',
                dni: '',
                peso: '',
                celular:'',
                buscardni:''  
            });
        })
        .catch(err => {
            Swal.fire('Error', 'Revise los espacios correctamente', 'error');
        })
    }

    return (
        <>
            <div className = "edit-member__title">
                EDITAR DATOS DE MIEMBRO
            </div>

            <div className = "edit-member__search">
                <Search 
                    BuscarDni = {buscardni} 
                    handleBuscarDni = { handleInputChange }
                    name = {"buscardni"}
                    handleSearchDni = { handleSearchDni }
                />
            </div>
            
            <div className = "edit-member__dash-container">

                <div className = "edit-member__box-container">

                    <div className = "edit-member__form">

                        <div className = "edit-inputs__form">

                            <Input
                                autocomplete = "off"
                                name= "dni"
                                type = "number"
                                text = "DNI"
                                placeholder = "Ingrese número de DNI"
                                value = { dni }
                                onChange = { handleInputChange  } 
                                disabled = "disabled"
                            />
                            <Input
                                autocomplete = "off"
                                name = "nombre"
                                text = "nombre"
                                placeholder = "Ingrese nombre completo"
                                value = { nombre }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                autocomplete = "off"
                                type = "number"
                                name = "peso"
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
                    <div className = "edit-member__image">

                        <LoadImage 
                            name = "telefono"
                            value = { fileUrl }
                            onChange = { processImage  }          
                        />

                    </div>
                    
                </div>

            </div>

            <div className = "edit-member__button">

                <button className = "component__button" onClick= {handleEditMember}>Editar Datos de Miembro</button>
                
            </div>
        </>

    )
}
