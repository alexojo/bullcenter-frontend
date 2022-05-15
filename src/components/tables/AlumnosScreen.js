import React,{useState,useEffect, useRef} from 'react';
import MaterialTable from "material-table";
import {listarUsuarios, crearMiembro, actualizarMiembro} from "../api/apiCore"
import  {RegisterMatriculaModal} from "../register-matricula/RegisterMatriculaModal"
import "../../index.css"


import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { selectUser } from '../../reducers/authReducer';
import { ModificarDiasDisponibles } from '../functions/RegistrarMatricula';

export const AlumnosScreen = () => {

    const user = useSelector( selectUser );
    // Form para Registrar Miembro ===================================

    const handleRegisterMember = ( newRow ) => {
        const formValues = {nombre: newRow.nombre.toUpperCase(), dni: newRow.dni, peso: 0, celular: newRow.celular}
        crearMiembro(formValues).then(response =>{
            Swal.fire('Success', 'El usuario se registro exitosamente', 'success');
        })
        .catch(err =>{
            Swal.fire('Error', 'Revise que no hayan espacios vacíos y que el usuario no este registrado anteriormente', 'error');
        })
    }

    // Form para Editar Miembro ===================================
    const handleEditMember = ( updatedRow ) => {
        console.log(updatedRow.diasDisponibles);
        var fecha_vencimiento = ModificarDiasDisponibles(updatedRow.diasDisponibles);
        console.log(fecha_vencimiento)
        
        // Fecha de Vencimiento
        //var fecha_vencimiento = ModificarDiasDisponibles(updatedRow.diasDisponibles) fechaVencimiento: fecha_vencimiento
        const formValues = {nombre: updatedRow.nombre.toUpperCase(), dni: updatedRow.dni, peso: 0, 
            celular: updatedRow.celular, deuda: updatedRow.deuda, fechaVencimiento: fecha_vencimiento}

        actualizarMiembro( formValues,updatedRow.dni ).then(response =>{
            Swal.fire('Success', 'El usuario se actualizó exitosamente', 'success');
        })
        .catch(err => {
            Swal.fire('Error', 'Revise los espacios correctamente', 'error');
        })
    }


    // Datos de Tabla ===================================
    const [tableData, setTableData] = useState([])
    const [columns, setColumns] = useState([])

    
    

    // Registrar datos de matricula ===================================

    const [open, setOpen] = useState([false,''])

    const ActualizarTabla = () => {
        listarUsuarios()
        .then(resp=> {
            
            var Usuarios = []

            const usuarios = [...new Set(resp)];

            for (var i = 0 ; i < usuarios.length; i ++ ){

                //DIAS DISPONIBLES
                let d = new Date();
                let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
                let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
                let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

                let fecha_hoy  = ye.toString() + "-" + mo.toString() + "-" + da.toString();

                //--- FECHA DE VENCIMIENTO
                let aux_vencimiento = usuarios[i].fechaVencimiento.substring(0,10).split('-');
                let matricula_vence = new Date(aux_vencimiento[0], aux_vencimiento[1]-1, aux_vencimiento[2]);

                //--- FECHA DE HOY
                let aux_hoy = fecha_hoy.split('-');
                let fecha_sistema = new Date(aux_hoy[0], aux_hoy[1]-1, aux_hoy[2]);

                let dias_Disponibles = (matricula_vence - fecha_sistema)/(1000*60*60*24);

                var dni_aux = usuarios[i].dni
                var nombre_aux = usuarios[i].nombre
                var celular_aux = usuarios[i].celular
                var deuda_aux = usuarios[i].deuda
                var fechaVencimiento_aux = usuarios[i].fechaVencimiento.substring(0,10)

                const values = { dni: dni_aux, nombre: nombre_aux,
                                 celular:celular_aux, diasDisponibles:dias_Disponibles, deuda:deuda_aux,  fechaVencimiento: fechaVencimiento_aux };
    
                Usuarios.push(values)
            }

            setTableData(Usuarios)
        }      
        )
    }

    // Actualizar datos de tabla ===================================
    

    const tableRef = useRef();
    useEffect(()=>{
        console.log("tabla")
        ActualizarTabla()
        if(user.user !== null){

            if (user && user?.user.dni === "23980730"){
                setColumns([
                    { title: "DNI", field: "dni"},
                    { title: "Nombre", field: "nombre" },
                    { title: "Dias Disponibles", field: "diasDisponibles" },
                    { title: "Deuda", field: "deuda"},
                    { title: "Celular", field: 'celular' },
                    { title: "Fecha de Vencimiento", field: 'fechaVencimiento', editable: 'never' }
                ])
            }else {
                setColumns([
                    { title: "DNI", field: "dni"},
                    { title: "Nombre", field: "nombre" },
                    { title: "Dias Disponibles", field: "diasDisponibles", editable: 'never'},
                    { title: "Deuda", field: "deuda", editable:'never'},
                    { title: "Celular", field: 'celular' },
                    { title: "Fecha de Vencimiento", field: 'fechaVencimiento', editable: 'never' },
                ])
            }
        }
    },[open, user])
    return (
        <>
            <div className = "register-member__title">
                REGISTRO DE MIEMBROS
            </div>

            <div style={{ width: "97%", Maxheight:"90%"}}>
                <MaterialTable
                    title="Employee Data"
                    tableRef={tableRef}
                    data={tableData}
                    columns={columns}
                    editable={{
                        onRowAdd: (newRow) => new Promise((resolve, reject) => {
                            const updatedRows = [...tableData, { id: Math.floor(Math.random() * 100), ...newRow }]
                            
                            handleRegisterMember(newRow)

                            setTimeout(() => {
                                setTableData(updatedRows)
                                resolve()
                            }, 2000)
                        }),

                        onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
                            const index=oldRow.tableData.id;
                            const updatedRows=[...tableData]
                            updatedRows[index]=updatedRow

                            handleEditMember(updatedRow)

                            setTimeout(() => {
                                setTableData(updatedRows)
                                resolve()
                            }, 2000)
                        })

                    }}
                    options={{
                        actionsColumnIndex: -1,
                        addRowPosition: "first",
                        showTitle: false,
                        header: !open[0]
                    }}
                    actions={[
                        {
                            icon: 'save',
                            tooltip: "Registrar matrícula",
                            onClick: (event, rowData) => setOpen([true, rowData]),
                        }
                        ]}
                />
            </div>
            { open[0] && <RegisterMatriculaModal setOpen={ setOpen } datos={open} />}
      </>
    )
}
