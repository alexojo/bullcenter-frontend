import React, {useEffect} from 'react'
import { Input } from '../components/Input';
import { useForm } from '../../hooks/useForm';
import { Search } from '../components/Search';
import { read } from '../api/apiCore';

import Swal from 'sweetalert2';
import { RegisterMatricula, FechaHoy } from '../functions/RegistrarMatricula';

export const RegisterMatriculaScreen = () => {

    const fecha_hoy = FechaHoy();

    //------------------

    const [ formValues, handleInputChange, setValues ] = useForm({  
        nombre: '',
        dni: '',
        peso: 0,       
        celular:'',
        buscardni:'',
        fechaInicio:'',
        fechaVencimiento:'',
        deuda:0,
        montoDeuda:0,
        montoPagado:''
    });
    
    const { dni, nombre, buscardni, peso, celular, fechaVencimiento, fechaInicio, deuda, montoDeuda, montoPagado } = formValues;
    
    const [ formValues2, handleInputChange2, setValues2 ] = useForm({
        matriculado:'',
        fechaMatricula: fecha_hoy,
        tiempoMatricula: '',
        monto: ''
    });
    
    const { fechaMatricula, tiempoMatricula, monto } = formValues2;
    
    const handleSearchDni = (e) => {
        e.preventDefault();
        
        read(buscardni)
        .then(response => {
            if (response.error){
                Swal.fire('Error', 'El usuario no existe', 'error');
            } else {
                setValues({
                    ...formValues,
                    nombre : response.nombre,
                    dni : response.dni,
                    peso: response.peso,
                    celular: response.celular,
                    fechaInicio : response.fechaInicio,
                    fechaVencimiento : response.fechaVencimiento,
                    deuda: response.deuda
                });
                setValues2({
                    ...formValues2,
                    matriculado: response._id,
                });
                
            }
        })
        .catch(err => {
            console.log("pipipi");
            Swal.fire('Error', 'El usuario no existe', 'error');
        })
        
    }

    const Reset = () => {
        setValues({
            ...formValues,
            dni: '',
            nombre: '',
            peso: '',
            buscardni:'',
            celular:'',
            fechaVencimiento:'',
            fechaInicio:'',
            montoDeuda:0,
            deuda:0,
            montoPagado:''
        });
        setValues2({
            ...formValues,
            matriculado:'',
            fechaMatricula: fecha_hoy,
            tiempoMatricula: '',
            monto: ''  
        });
    }

    const handleMatricula = (e) => {
        e.preventDefault();
        let deudaTotal = deuda + montoDeuda;
        RegisterMatricula(fecha_hoy, fechaMatricula, fechaInicio, fechaVencimiento, tiempoMatricula, dni, nombre, peso, celular,deudaTotal, formValues2, Reset);
    }

    useEffect(() => {
        setValues({
          ...formValues,
          montoDeuda: monto - montoPagado
        });
        
    }, [monto, montoPagado])

    return (
        <>
            <div className = "edit-member__title">
                REGISTRAR MATRÍCULA
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
                                text = "DNI"
                                name = "dni"
                                placeholder = "Número de DNI"
                                disabled = "disabled"
                                value = { dni }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                text = "nombre"
                                name = "nombre"
                                placeholder = "Nombre completo"
                                disabled = "disabled"
                                value = { nombre }
                                onChange = { handleInputChange  } 
                            />
                            <Input
                                autocomplete = "off"
                                name = "fechaMatricula"
                                type = "date"
                                text = "fecha de matrícula"
                                placeholder = "Ingrese edad"
                                value = { fechaMatricula }
                                onChange = { handleInputChange2  } 
                            />

                            <Input
                                type = "number"
                                name = "tiempoMatricula"
                                text = "tiempo de Matricula"
                                placeholder = "Ingrese tiempo a matricular"
                                value = { tiempoMatricula }
                                onChange = { handleInputChange2 } 
                            />

                            <div className='register-matricula__montos'>
                                <Input
                                    type = "number"
                                    name = "monto"
                                    text = "monto"
                                    placeholder = "Ingrese monto total"
                                    value = { monto }
                                    onChange = { handleInputChange2  } 
                                />
                                <Input
                                    type = "number"
                                    name = "montoPagado"
                                    text = "monto pagado"
                                    placeholder = "Ingrese monto pagado"
                                    value = { montoPagado }
                                    onChange = { handleInputChange  }
                                />
                                <Input
                                    type = "number"
                                    name = "montoDeuda"
                                    text = "monto deuda"
                                    disabled = "disabled"
                                    value = { montoDeuda }
                                    onChange = { handleInputChange  }
                                />
                            </div>
                            


                        </div>               
                    </div>
                    <div className = "edit-member__image">
                        <div className = "edit-image__image">
                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="profile_picture"/>
                        </div>
                    </div>    

                </div>
            </div>
            <div className = "edit-member__button">
                <button className = "component__button" onClick={handleMatricula}>Registrar Matrícula</button>           
            </div>
        </>
    )
}