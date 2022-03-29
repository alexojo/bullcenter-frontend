
import { crearMatricula, actualizarMiembro } from '../api/apiCore';

import Swal from 'sweetalert2';

export const RegisterMatricula = ( fecha_hoy, 
                                    fechaMatricula,
                                    fechaInicio,
                                    fechaVencimiento,
                                    tiempoMatricula,
                                    dni, 
                                    nombre, 
                                    peso,
                                    celular,
                                    deudaTotal,
                                    formValues2,
                                    Reset) => {
    
    const buscardni = dni;                                  
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
        
        if (diasDisponibles <= 0){// SI SUS DIAS DISPONIBLES <= 0, YA NO TIENE DIAS DISPONIBLES
            
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


            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, fechaInicio: fecha_inicio, deuda: deudaTotal};
            
            
            actualizarMiembro(datos_matricula,buscardni)

            //console.log("no tiene dias");
        } else{// SI SUS DIAS DISPONIBLES > 0, AUN TIENE DIAS DISPONIBLES

            //--- FECHA DE VENCIMIENTO
            let aux_vencimiento = fechaVencimiento.substring(0,10).split('-');
            let matricula_vence = new Date(aux_vencimiento[0], aux_vencimiento[1]-1, aux_vencimiento[2]);
            matricula_vence = new Date(matricula_vence.setDate(matricula_vence.getDate() + (tiempoMatricula * 30)));

            let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(matricula_vence);
            let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(matricula_vence);
            let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(matricula_vence);

            let fecha_vencimiento  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vencimiento, celular, fechaInicio: fechaInicio, deuda: deudaTotal};
            

            actualizarMiembro(datos_matricula,buscardni);

            //console.log("aun tiene dias");
        }
        //console.log("fv > fs")

    // SI FECHA DE VENCIMIENTO ES MENOR, ENTONCES HAY MENOS DIAS
    } else {

        //--- FECHA DE MATRICULA VENCE
        let aux_hoy = fechaVencimiento.substring(0,10).split('-');
        let fecha_matricula_vence = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

        if ( fecha_vence >= fecha_matricula_vence){

            var datos_matricula = { dni, nombre, peso, fechaVencimiento: fecha_vence, celular, fechaInicio: fecha_matricula, deuda: deudaTotal};

            actualizarMiembro(datos_matricula,buscardni);
        }
    }



    crearMatricula(formValues2)
    .then(response =>{
        if (response.error){
            Swal.fire('Error', 'Ocurrió un error al regitrar la matrícula', 'error');
        } else {
            Swal.fire('Success', 'La matrícula se registro exitosamente', 'success');
            Reset(); 
        } 
    })
    .catch(err =>{
        Swal.fire('Error', 'Ocurrió un error al regitrar la matrícula', 'error');
    })

}

export const FechaHoy = () => {

    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    const fecha_hoy  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

    return fecha_hoy
}

export var ModificarDiasDisponibles = ( diasDisponibles ) => {

    var aux_hoy = FechaHoy().split('-');
    //console.log("1",aux_hoy)
    let aux_hoy_1 = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);
    //console.log("2",aux_hoy, diasDisponibles, typeof(diasDisponibles))
    aux_hoy_1 = new Date(aux_hoy_1.setDate(aux_hoy_1.getDate() + parseInt(diasDisponibles)));
    //console.log("3",aux_hoy, typeof(diasDisponibles))

    let ye1 = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(aux_hoy_1);
    let mo1 = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(aux_hoy_1);
    let da1 = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(aux_hoy_1);

    var fecha_vencimiento  = ye1.toString() + "-" + mo1.toString() + "-" + da1.toString();

    return fecha_vencimiento;

}