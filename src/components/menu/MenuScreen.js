import React, {useState, useEffect} from "react";

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es'
import { useForm } from '../../hooks/useForm';
import { CardDays } from "../components/CardDays";
import { actualizarMiembro, listarMatriculas, listarMatriculas2, listarUsuarios, read_aux } from "../api/apiCore";


export const MenuScreen = () => {
   
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    let fechainicial = ye.toString() + "-" + mo.toString() + "-01";
    let fechafinal   = ye.toString() + "-" + mo.toString() + "-" + da.toString();

    const [ formValues, handleInputChange ] = useForm({
        date1: fechainicial,
        date2: fechafinal
    });

    const [totalDnis, setTotalDnis] = useState([]);
    const [index, setIndex] = useState(0)


    const [total_matriculas, setTotal_Matriculas] = useState(0);
    const [miembros_matriculados, setMiembros_Matriculados] = useState(0);
    const [miembros_activos, setMiembros_Activos] = useState(0);

    const { date1, date2 } = formValues;

    // CARD TOTAL DE MATRICULAS
    const TotalDeMatriculas = () => {
        listarMatriculas()
        .then(resp=> {
            
            const matriculas = [...new Set(resp)];
            var total = 0;

            for (var i = 0 ; i < matriculas.length; i ++ ){ 
                
                let fecha_matricula = matriculas[i].fechaMatricula.substring(0,10).split('-');
                fecha_matricula = new Date(fecha_matricula[0], fecha_matricula[1]-1, fecha_matricula[2]);

                //-- FECHA INICIAL
                let fecha_inicial = date1.split('-');
                fecha_inicial = new Date(fecha_inicial[0], fecha_inicial[1]-1, fecha_inicial[2]);
                //-- FECHA FINAL
                let fecha_final = date2.split('-');
                fecha_final = new Date(fecha_final[0], fecha_final[1]-1, fecha_final[2]);
                
                if (fecha_matricula >= fecha_inicial 	&& fecha_matricula <= fecha_final){
                    total =  total + matriculas[i].monto;
                }

            }
            setTotal_Matriculas( total );

        })
    }

    // CARD MIEMBROS MATRICULADOS
    const MiembrosMatriculados = () => {
        listarUsuarios()
        .then(resp=>{
            
            const usuarios = [...new Set(resp)];
            var nuevos = 0;

            for (var i = 0 ; i < usuarios.length; i ++ ){ 
                
                let fecha_creacion = usuarios[i].createdAt.substring(0,10).split('-');
                fecha_creacion = new Date(fecha_creacion[0], fecha_creacion[1]-1, fecha_creacion[2]);

                //-- FECHA INICIAL
                let fecha_inicial = date1.split('-');
                fecha_inicial = new Date(fecha_inicial[0], fecha_inicial[1]-1, fecha_inicial[2]);
                //-- FECHA FINAL
                let fecha_final = date2.split('-');
                fecha_final = new Date(fecha_final[0], fecha_final[1]-1, fecha_final[2]);

                if (fecha_creacion >= fecha_inicial && fecha_creacion <= fecha_final){
                    nuevos =  nuevos + 1;
                }

            }
            setMiembros_Matriculados( nuevos );
        })
    }

    // MIEMBROS ACTIVOS
    const MiembrosActivos = () => {
        listarUsuarios()
        .then(resp=>{
            
            const usuarios = [...new Set(resp)];
            var activos = 0;

            for (var i = 0 ; i < usuarios.length; i ++ ){ 
                
                var disponible = usuarios[i].diasDisponibles;

                if (disponible >= 1){
                    activos =  activos + 1;
                }

            }
            setMiembros_Activos( activos );
        })
    }

    //------------------------------------------
    useEffect(() => {
        TotalDeMatriculas()
        MiembrosMatriculados()
        MiembrosActivos()
    }, [date1, date2])

    const handleLogin = (e) => {
        e.preventDefault();
        TotalDeMatriculas()
    }

    const style = {
        height: '150px',
        margin : '10px 20px 10px 20px',

    }



    const handleReset = (e) => {
        e.preventDefault();

        listarUsuarios()
        .then(resp=> {
            
            const usuarios = [...new Set(resp)];

            const dnis = [];

            for (var i = 0 ; i < usuarios.length; i ++ ){ 

                var dni_aux = usuarios[i].dni
                var nombre_aux = usuarios[i].nombre
                var peso_aux = usuarios[i].peso
                var celular_aux = usuarios[i].celular
                var fechaInicio_aux = "2001-01-01"
                var fechaVencimiento_aux = "2001-01-02"
                
                var buscardni = usuarios[i].dni;
                
                
                const formValues = { dni: dni_aux, nombre: nombre_aux, peso:peso_aux, celular:celular_aux, buscardni, fechaInicio: fechaInicio_aux, fechaVencimiento: fechaVencimiento_aux };
                actualizarMiembro(formValues,buscardni)

                dnis.push(dni_aux)

                console.log("listo")
            }

            setTotalDnis(dnis)

            //

        })
    } 

    const handleAlmacen = (e) => {
        e.preventDefault();
        listarUsuarios()
        .then(resp=> {
            const dnis = [];
            const usuarios = [...new Set(resp)];

            for (var i = 0 ; i < usuarios.length; i ++ ){

                var dni_aux = usuarios[i].dni
                dnis.push(dni_aux)
            }
            setTotalDnis(dnis)
        })

    }


    const handleMatricula = (e) => {
        e.preventDefault();

        listarMatriculas()
        .then(resp=> {
            const matriculas = [...new Set(resp)];
            

            var indexa = matriculas.length - (index + 1)

            console.log(index,matriculas.length-index, indexa)
            console.log(matriculas[indexa])

            var fechaInicio = matriculas[indexa].matriculado.fechaInicio
            var fechaVencimiento = matriculas[indexa].matriculado.fechaVencimiento

            var dni = matriculas[indexa].matriculado.dni
            var nombre = matriculas[indexa].matriculado.nombre
            var peso = matriculas[indexa].matriculado.peso
            var celular = matriculas[indexa].matriculado.celular
            var buscardni = matriculas[indexa].matriculado.dni;


            var buscardni_aux = matriculas[indexa].matriculado.dni;
            

            var fechaMatricula = matriculas[indexa].fechaMatricula.substring(0,10);
            var tiempoMatricula = matriculas[indexa].tiempoMatricula;

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
                    console.log("mayor que sistema, y no tiene dias")
        
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
                    
                    console.log("mayor que sistema, y tiene dias")
                    actualizarMiembro(datos_matricula,buscardni);
                }

            // SI FECHA DE VENCIMIENTO ES MENOR, ENTONCES HAY MENOS DIAS
            } else {

                //--- FECHA DE MATRICULA VENCE
                let aux_hoy = fechaVencimiento.substring(0,10).split('-');
                let fecha_matricula_vence = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

                if ( fecha_vence >= fecha_matricula_vence){

                    console.log("fecha de vencimiento es mayor")

                    var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vence, celular, fechaInicio: fecha_matricula, buscardni };

                    actualizarMiembro(datos_matricula,buscardni);
                }
            }

            
            console.log("_______________________________")
        })
        
        setIndex(index + 1)
    }
    
    
    return (
        <>
            <div className = "menu__title">
                RESUMEN DE SECTOR 33
            </div>

            {/* <button onClick={handleMatricula}>HOLAAA</button>

            <button onClick={handleReset}>RESETEAR</button>

            <button onClick={handleAlmacen}>DNIS</button> */}

            
            <div className = "menu__fechas">

                <MuiPickersUtilsProvider utils = {DateFnsUtils} locale = { esLocale }> 

                    <div className = "register-attendance__date">

                        <div className="dates">
                            <label>Fecha Inicial</label>
                            <input format = "yyyy-mm-dd" type="date" name ="date1" value= { date1 } onChange = { handleInputChange } />      
                        </div> 

                        <div className="dates">
                            <label>Fecha Final</label>
                            <input format = "yyyy-mm-dd" type="date" name ="date2" value= { date2 } onChange = { handleInputChange }/>
                        </div>                  

                    </div>
                </MuiPickersUtilsProvider>
            </div>

            <div className = "menu__cards">
                <CardDays icon = "fas fa-money-check-alt" days = {"S/."+total_matriculas.toString()+".00"} label = {"Total de Matrículas"} style = {style}/>

                <CardDays icon = "fas fa-users" days = {miembros_matriculados} label = {"Miembros Nuevos"} style = {style}/>

                <CardDays icon = "fas fa-user-check" days = {miembros_activos} label = {"Miembros Activos"} style = {style}/>

 
            </div>
            
        </>
    )
}
