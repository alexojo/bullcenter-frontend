import React,{useState,useEffect} from 'react';
import MaterialTable from "material-table";
import {listarUsuarios} from "../api/apiCore"

export const AlumnosScreen = () => {

    const [tableData, setTableData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const columns = [
        { title: "DNI", field: "dni" },
        { title: "Nombre", field: "nombre" },
        { title: "Dias Disponibles", field: "diasDisponibles" },
        { title: "Celular", field: 'celular' },
        { title: "Fecha de Vencimiento", field: 'fechaVencimiento' },
    ]
    const handleBulkDelete = () => {
        const updatedData = tableData.filter(row => !selectedRows.includes(row))
        setTableData(updatedData)
    }

    useEffect(()=>{
        listarUsuarios()
        .then(resp=>setTableData(resp))
    },[])

    return (
        <>
            <div className = "register-member__title">
                REGISTRO DE MIEMBROS
            </div>

            <div style={{ width: "97%", Maxheight:"90%"}}>
                
                <MaterialTable
                    title="Usuarios"
                    data={tableData}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    columns={columns}
                    options={{
                    selection: true
                    }}
                    actions={[
                    {
                        icon: 'search',
                        tooltip: "Delete all selected rows",
                        onClick: () => handleBulkDelete()
                    }
                    ]}
                />


            </div>

            <div style={{ width: "97%", Maxheight:"90%"}}>
                
                <MaterialTable
                    title="Usuarios"
                    data={tableData}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    columns={columns}

                    actions={[
                    {
                        icon: 'edit',
                        tooltip: "Editar datos",
                        onClick: (event, rowData) =>  EditarDatos(rowData)
                    },
                    {
                        icon: 'save',
                        tooltip: "Registrar matrícula",
                        onClick: (event, rowData) => alert("You saved " + rowData.nombre)
                    }
                    ]}
                />
            </div>
      </>
    )
}
