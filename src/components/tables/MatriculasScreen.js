import React,{useState, useEffect} from 'react';
import MaterialTable from "material-table";
import {listarMatriculas} from "../api/apiCore"

export const MatriculasScreen = () => {

    const [tableData, setTableData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    

    const columns = [
        { title: "Matriculado por", field: "encargadoMatricula" },
        { title: "Miembro", field: "matriculado.nombre" },
        { title: "Fecha de matricula", field: 'fechaMatricula' },
        { title: "Fecha de vencimiento", field: 'matriculado.fechaVencimiento' },
        { title: "Meses", field: 'tiempoMatricula' },
        { title: "Monto", field: 'monto' }
    ]

    const handleBulkDelete = () => {
        const updatedData = tableData.filter(row => !selectedRows.includes(row))
        setTableData(updatedData)
    }

    useEffect(()=>{
        listarMatriculas()
        .then(resp=>setTableData(resp))
    },[])  

    return (
        <>
            <div className = "register-member__title">
                REGISTRO DE MATRÍCULAS
            </div>

            <div style={{ width: "97%", Maxheight:"90%"}}>
                
                <MaterialTable
                    title="Matrículas"
                    data={tableData}
                    onSelectionChange={(rows) => setSelectedRows(rows)}
                    columns={columns}
                    options={{
                    selection: true
                    }}
                    actions={[
                    {
                        icon: 'delete',
                        tooltip: "Delete all selected rows",
                        onClick: () => handleBulkDelete()
                    }
                    ]}
                />


            </div>
      </>
    )
}
