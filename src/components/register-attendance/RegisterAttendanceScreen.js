import React, { useState, useEffect } from 'react'
import { CardDays } from '../components/CardDays'
import { Input } from '../components/Input'
import { Search } from '../components/Search'


import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es'
import { useForm } from '../../hooks/useForm';
import { read, registrarAsistencia } from '../api/apiCore';

import Swal from 'sweetalert2';


export const RegisterAttendanceScreen = () => {

    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    let fechainicial = ye.toString() + "-" + mo.toString() + "-01";
    let fechafinal   = ye.toString() + "-" + mo.toString() + "-" + da.toString();

    //----------------------------------------- RANGO DE FECHAS

    const [ formValues, handleInputChange,setValues ] = useForm({
        date1: fechainicial,
        date2: fechafinal
    });

    const { date1, date2 } = formValues;

    //----------------------------------------- FORM DE RECUPERAR DNI

    const [ formValues2, handleInputChange2, setValues2 ] = useForm({
        nombre: '',
        fechaVencimiento: '',
        buscardni:''
    });
    
    const { nombre, fechaVencimiento, buscardni } = formValues2;

    //----------------------------------------- FORM DIAS ASISTIDOS

    const [ formValues3, handleInputChange3, setValues3 ] = useForm({
        dni: '',
        diasAsistidos: []
    });

    const { dni, diasAsistidos } = formValues3;

    //----------------------------------------- CARD DAYS

    const [diasCardDisponibles, setCardDiasDisponibles] = useState(0);
    const [diasCardAsistidos, setCardDiasAsistidos] = useState(0);
    const [diasCardNoAsistidos, setCardDiasNoAsistidos] = useState(0);

    useEffect(() => {
        DiasCards()
    }, [date1, date2])
    
    

    const DiasCards = () => {
        read(buscardni)
        .then(response => {
            var auxCardAsistidos = 0;
            var auxCardNoAsistidos = 0;

            var dias_asistidos = [...new Set(response.diasAsistidos)]

            for (var i = 0 ; i < dias_asistidos.length; i ++ ){ 

                let fecha_aux = dias_asistidos[i].split('-');
                fecha_aux = new Date(fecha_aux[0], fecha_aux[1]-1, fecha_aux[2]); // FECHA ASISTIDA
                //-- FECHA INICIAL
                let fecha_inicial = date1.split('-');
                fecha_inicial = new Date(fecha_inicial[0], fecha_inicial[1]-1, fecha_inicial[2]);
                //-- FECHA FINAL
                let fecha_final = date2.split('-');
                fecha_final = new Date(fecha_final[0], fecha_final[1]-1, fecha_final[2]);

                if (fecha_aux >= fecha_inicial 	&& fecha_aux <= fecha_final){
                    auxCardAsistidos = auxCardAsistidos + 1;
                }

                auxCardNoAsistidos = ( (fecha_final - fecha_inicial)/(1000*60*60*24) ) - auxCardAsistidos;
            }  

            setCardDiasAsistidos( auxCardAsistidos );
            setCardDiasNoAsistidos( auxCardNoAsistidos );


        })
        .catch(err => {

        })
    }

    //----------------------------------------- EVENTOS CLICK
    const handleSearchDni = (e) => {
        e.preventDefault();
        read(buscardni)
        .then(response => {
            if (response.error){
                Swal.fire('Error', 'El usuario no existe', 'error');
            } else {
                setValues2({
                    ...formValues2,
                    nombre : response.nombre,
                    fechaVencimiento : response.fechaVencimiento.substring(0,10),
                })
                
                setValues3({
                    ...formValues3,
                    dni: response.dni,
                    diasAsistidos: response.diasAsistidos
                });
                
                let d = new Date();
                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

                let fecha_hoy  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                //--- FECHA DE VENCIMIENTO
                let aux_vencimiento = response.fechaVencimiento.substring(0,10).split('-');
                let matricula_vence = new Date(aux_vencimiento[0], aux_vencimiento[1]-1, aux_vencimiento[2]);

                //--- FECHA DE HOY
                let aux_hoy = fecha_hoy.split('-');
                let fecha_sistema = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

                let diasDisponibles = (matricula_vence - fecha_sistema)/(1000*60*60*24);

                setCardDiasDisponibles(diasDisponibles)                
                DiasCards()

            }
        })
        .catch(err => {
            Swal.fire('Error', 'El usuario no existe', 'error');
        })
    }

    const Reset = () => {
        setValues({
            ...formValues,
            date1: fechainicial,
            date2: fechafinal
        });
        setValues2({
            ...formValues2,
            nombre: '',
            fechaVencimiento: '',
            buscardni:'' 
        });
        setValues3({
            ...formValues3,
            dni: '',
            diasAsistidos: [] 
        });
        setCardDiasDisponibles(0)
    }

    const handleRegisterAttendance = (e) => {
        e.preventDefault();
        registrarAsistencia(formValues3,buscardni).then(response =>{
            Swal.fire('Success', 'Se registró la asistencia de hoy', 'success');
            Reset()
        })
        .catch(err => {
            Swal.fire('Error', 'No se pudo registrar la asistencia de hoy', 'error');
        })
    }

    return (
        <>
            <div className = "register-attendance__title">
                REGISTRAR ASISTENCIA
            </div>

            <div className = "register-attendance__search">
                <Search 
                    BuscarDni = {buscardni} 
                    handleBuscarDni = { handleInputChange2 }
                    name = {"buscardni"}
                    handleSearchDni = { handleSearchDni }
                />
            </div>
            
            <div className = "register-attendance__dash-container">

                <div className = "register-attendance__box-container">

                    <div className = "register-attendance__form">

                        <div className = "register-inputs__form">

                            <Input
                                text = "nombre"
                                placeholder = "Nombre completo"
                                disabled="disabled"
                                value = { nombre }
                                onChange = { handleInputChange2  }
                            />
                            <Input
                                autocomplete = "off"
                                name = "peso"
                                type = "date"
                                text = "fecha vence matricula"
                                value = { fechaVencimiento }
                                onChange = { handleInputChange2  } 
                            />

                        </div>               
                    </div>

                    <div className = "register-attendance__image">

                        <div className = "register-image__image">
                            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="profile_picture"/>
                        </div>

                    </div>
                    
                </div>

            </div>

            <div className = "register-attendance__days-container">

                <MuiPickersUtilsProvider utils = {DateFnsUtils} locale = { esLocale }> 

                    <div className = "register-attendance__date">
                        <form className= "form-attendance__date">
                            <div className="dates">
                                <label>Fecha Inicial</label>
                                <input format = "yyyy-mm-dd" type="date" name ="date1" value= { date1 } onChange = { handleInputChange } />      
                            </div> 

                            <div className="dates">
                                <label>Fecha Final</label>
                                <input format = "yyyy-mm-dd" type="date" name ="date2" value= { date2 } onChange = { handleInputChange }/>
                            </div>                  
                        </form>

                    </div>
                </MuiPickersUtilsProvider>

                <div className = "register-attendance__cards">

                    <CardDays icon = "fas fa-user-check" days = {diasCardAsistidos} label = {"Dias Asistidos"}/>

                    <CardDays icon = "fas fa-user-times" days = {diasCardNoAsistidos} label = {"Dias No Asistidos"}/>

                    <CardDays icon = "fas fa-user-clock" days = {diasCardDisponibles} label = {"Dias Disponibles"}/>
                
                </div>

            </div>

            <div className = "register-attendance__button">

                <button className = "component__button" onClick = { handleRegisterAttendance }>Registrar Asistencia</button>
                
            </div>
        </>

    )
}