import React from 'react'
import { Input } from '../components/Input';
import { useForm } from '../../hooks/useForm';
import { Search } from '../components/Search';
import { crearMatricula,read,actualizarMiembro } from '../api/apiCore';

import Swal from 'sweetalert2';

export const RegisterMatriculaScreen = () => {

    //--- FECHA
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    let fecha_hoy  = ye.toString() + "-" + mo.toString() + "-" + da.toString();
    

    //------------------

    const [ formValues, handleInputChange, setValues ] = useForm({  
        nombre: '',
        dni: '',
        peso: 0,       
        celular:'',
        diasDisponibles:'',
        buscardni:'',
        fechaVencimiento:''
    });
    
    const { dni, nombre, buscardni,diasDisponibles, peso, celular, fechaVencimiento } = formValues;
    
    const [ formValues2, handleInputChange2, setValues2 ] = useForm({
        matriculado:'',
        fechaMatricula: fecha_hoy,
        tiempoMatricula: '',
        monto: ''
    });
    
    const { matriculado, fechaMatricula, tiempoMatricula, monto } = formValues2;
    
    const handleSearchDni = (e) => {
        e.preventDefault();
        
        read(buscardni)
        .then(response => {
            //console.log(response);
            if (response.error){
                Swal.fire('Error', 'El usuario no existe', 'error');
            } else {
                setValues({
                    ...formValues,
                    nombre : response.nombre,
                    dni : response.dni,
                    peso: response.peso,
                    celular: response.celular,
                    diasDisponibles : response.diasDisponibles,
                    fechaVencimiento : response.fechaVencimiento
                });
                setValues2({
                    ...formValues2,
                    matriculado: response._id,
                });
                
            }
        })
        .catch(err => {
            //console.log("pipipi");
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
            diasDisponibles:'',
            celular:'',
            fechaVencimiento:''
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
        ////console.log("FV",fechaVencimiento.substring(0,10))
        ////console.log(diasDisponibles)
        //--- FECHA DE HOY
        let aux_hoy = fecha_hoy.split('-');
        let fecha_sistema = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);
        //--- FECHA DE INSCRIPCION
        let aux_matricula = fechaMatricula.split('-');
        let fecha_matricula = new Date(aux_matricula[0], aux_matricula[1]-1, aux_matricula[2]);
        //--- FECHA DE VENCIMIENTO
        let fecha_vence = new Date(aux_matricula[0], aux_matricula[1]-1, aux_matricula[2]);
        fecha_vence = new Date(fecha_vence.setDate(fecha_matricula.getDate() + (tiempoMatricula * 30)));

        ////console.log(formValues);
        //console.log( )
        // SI FECHA DE VENCIMIENTO ES MAYOR, ENTONCES HAY NUEVOS DIAS
        if (fecha_vence > fecha_sistema) {

            //console.log( (fecha_vence - fecha_matricula)/(1000*60*60*24) )
            
            let dias_disponibles = 0;
            
            if (diasDisponibles <= 0){// SI SUS DIAS DISPONIBLES <= 0
                
                let dias_disponibles = (fecha_vence - fecha_sistema)/(1000*60*60*24);

                let matricula_vence = fecha_vence;

                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_vence);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_vence);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_vence);

                let fecha_vencimiento  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, diasDisponibles: dias_disponibles, buscardni };
                
                ////console.log(datos_matricula)


                actualizarMiembro(datos_matricula,buscardni)
    
                //console.log("no tiene dias", dias_disponibles);
            } else{// SI SUS DIAS DISPONIBLES > 0
                
                let dias_disponibles = (fecha_vence - fecha_sistema)/(1000*60*60*24) + diasDisponibles;
                
                let matricula_vence = new Date();
                matricula_vence = new Date(matricula_vence.setDate(fecha_sistema.getDate() + dias_disponibles));

                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_vence);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_vence);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_vence);

                let fecha_vencimiento  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, diasDisponibles: dias_disponibles, buscardni };
                
                //console.log(datos_matricula)

                actualizarMiembro(datos_matricula,buscardni);

                //console.log("aun tiene dias", dias_disponibles);
            }
            //console.log(dias_disponibles)


            //console.log("fv > fs")
        // SI FECHA DE VENCIMIENTO ES MENOR, ENTONCES HAY MENOS DIAS
        } else {
            
            //console.log("entra aca")
            //--- FECHA DE MATRICULA VENCE
            let aux_hoy = fechaVencimiento.substring(0,10).split('-');
            let fecha_matricula_vence = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

            let dias_disponibles = (fecha_vence - fecha_sistema)/(1000*60*60*24);

            if ( fecha_matricula_vence < fecha_vence){

                //console.log("entra aca", fecha_vence, dias_disponibles)

                var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vence, celular, diasDisponibles: dias_disponibles, buscardni };

                actualizarMiembro(datos_matricula,buscardni);
            }

            
        }
        crearMatricula(formValues2)
        .then(response =>{
            Swal.fire('Success', 'La matrícula se registro exitosamente', 'success');
            Reset();       
        })
        .catch(err =>{Swal.fire('Error', 'Ocurrió un error al regitrar la matrícula', 'error');})
        
    }

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

                            <Input
                                type = "number"
                                name = "monto"
                                text = "monto"
                                placeholder = "Ingrese monto a pagar"
                                value = { monto }
                                onChange = { handleInputChange2  } 
                            />


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

const handleMatricula = (e) => {
    e.preventDefault();
    
    listarMatriculas()
    .then(resp=> {

        const matriculas = [...new Set(resp)];

        for (var i = 0 ; i < matriculas.length; i ++ ){ 
             
            // RECUPERANDO DATOS DE USUARIO
            

            var buscardni_aux = matriculas[i].matriculado.dni;

            var fechaMatricula = matriculas[i].fechaMatricula.substring(0,10);
            var tiempoMatricula = matriculas[i].tiempoMatricula;

            read_aux(buscardni_aux, fechaMatricula, tiempoMatricula)
            .then(response => {

                var fechaInicio = response.fechaInicio
                var fechaVencimiento = response.fechaVencimiento

                var dni = response.dni
                var nombre = response.nombre
                var peso = response.peso
                var celular = response.celular
                var buscardni = response.dni;

                if (dni === "71515941"){

                    //console.log("-",dni, fechaMatricula, tiempoMatricula)
                    // TRABAJAR CON MATRICULAS //////////////////////

                    

                    //--- FECHA
                    let d = new Date();
                    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
                    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
                    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

                    let fecha_hoy  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                    //--- FECHA DE HOY
                    let aux_hoy = fecha_hoy.split('-');
                    let fecha_sistema = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);
                    //--- FECHA DE INSCRIPCION
                    let aux_matricula = fechaMatricula.split('-');
                    let fecha_matricula = new Date(aux_matricula[0], aux_matricula[1]-1, aux_matricula[2]);
                    //--- FECHA DE VENCIMIENTO
                    let fecha_vence = new Date(aux_matricula[0], aux_matricula[1]-1, aux_matricula[2]);
                    fecha_vence = new Date(fecha_vence.setDate(fecha_matricula.getDate() + (tiempoMatricula * 30)));

                    
                    //console.log("xd", fechaInicio, fechaVencimiento, i, fecha_matricula, fecha_vence)



                    // SI FECHA DE VENCIMIENTO ES MAYOR, ENTONCES HAY NUEVOS DIAS
                    if (fecha_vence > fecha_sistema) {

                        let aux_vencio = fechaVencimiento.substring(0,10).split('-');
                        let fecha_vence_user = new Date(aux_vencio[0], aux_vencio[1]-1, aux_vencio[2]);
            
                        let diasDisponibles = (fecha_vence_user - fecha_sistema)/(1000*60*60*24);
                        
                        if (diasDisponibles < 0){// SI SUS DIAS DISPONIBLES <= 0, YA NO TIENE DIAS DISPONIBLES
                            
                            let matricula_vence = fecha_vence;  
                            // CAMBIANDO A FORMATO DE BD - FECHA VENCE
                            let ye_v = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_vence);
                            let mo_v = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_vence);
                            let da_v = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_vence);
                            let fecha_vencimiento  = ye_v.toString() + "-" + mo_v.toString() + "-" + da_v.toString();

                            let matricula_inicio = fecha_matricula;  
                            // CAMBIANDO A FORMATO DE BD - FECHA MATRICULA
                            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_inicio);
                            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_inicio);
                            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_inicio);
                            let fecha_inicio = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, fechaInicio: fecha_inicio, buscardni };
                            
                            
                            actualizarMiembro(datos_matricula,buscardni)
                            //console.log("mayor que sistema, y no tiene dias")
                
                        } else{// SI SUS DIAS DISPONIBLES > 0, AUN TIENE DIAS DISPONIBLES

                            //--- FECHA DE VENCIMIENTO
                            let aux_vencimiento = fechaVencimiento.substring(0,10).split('-');
                            let matricula_vence = new Date(aux_vencimiento[0], aux_vencimiento[1]-1, aux_vencimiento[2]);
                            matricula_vence = new Date(matricula_vence.setDate(matricula_vence.getDate() + (tiempoMatricula * 30)));

                            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_vence);
                            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_vence);
                            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_vence);

                            let fecha_vencimiento  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, fechaInicio: fechaInicio, buscardni };
                            
                            //console.log("mayor que sistema, y tiene dias")
                            actualizarMiembro(datos_matricula,buscardni);
                        }

                    // SI FECHA DE VENCIMIENTO ES MENOR, ENTONCES HAY MENOS DIAS
                    } else {

                        //--- FECHA DE MATRICULA VENCE
                        let aux_hoy = fechaVencimiento.substring(0,10).split('-');
                        let fecha_matricula_vence = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

                        if ( fecha_vence >= fecha_matricula_vence){

                            //console.log("fecha de vencimiento es mayor")

                            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vence, celular, fechaInicio: fecha_matricula, buscardni };

                            actualizarMiembro(datos_matricula,buscardni);
                        }
                    }
                    
                }

            })


    
        }

    })


}