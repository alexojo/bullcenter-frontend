import MaterialTable from 'material-table';
import { TablePagination, Grid, Typography, Divider } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { listarMatriculas } from '../api/apiCore';
import { FechaHoy } from '../functions/RegistrarMatricula';

export const DailyScreen = () => {

  const [tableData, setTableData] = useState([])
  const [summaryData, setSummaryData] = useState(0)
  // FECHA DEL DIA ACTUAL
  let d = new Date();
  let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

  let fechainicial = ye.toString() + "-" + mo.toString() + "-01";
  let fechafinal   = ye.toString() + "-" + mo.toString() + "-" + da.toString();

  //DATOS DE TABLA
  const columns = [
    { title: "Boleta", field: "boleta" },
    { title: "Matriculado por", field: "encargadoMatricula" },

    { title: "Miembro", field: "matriculado" },
    { title: "Meses", field: 'tiempoMatricula' },
    { title: "Monto", field: 'monto' },
    { title: "Deuda", field: 'deuda'}
  ]

  

  const ListarMatriculasHoy = () =>{
    listarMatriculas()
    .then(resp=> {

      var table = [];
      const matriculas = [...new Set(resp)];

      for (var i = 0 ; i < matriculas.length; i ++ ){

        const fecha_hoy = FechaHoy();
        if(matriculas[i].fechaMatricula.substring(0,10) === fecha_hoy){
          
          const values = {
            boleta: matriculas[i].boleta,
            encargadoMatricula: matriculas[i].encargadoMatricula,
            matriculado: matriculas[i].matriculado.nombre,
            tiempoMatricula: matriculas[i].tiempoMatricula,
            monto: matriculas[i].monto,
            deuda: matriculas[i].matriculado.deuda
          }

          table.push(values)
        }
      }
      setTableData(table)
      
      var total = 0;
      var deudas = 0;
      for (var i = 0 ; i < table.length; i ++ ){
        total = total + table[i].monto;
        deudas = deudas + table[i].deuda;
      }
      setSummaryData(total-deudas)
    })
  }


  // CARGAR TABLA
  useEffect(()=>{
    ListarMatriculasHoy()

  },[])  


  return (
    <>
      <div className = "menu__title">
        RESUMEN DE {fechafinal}
      </div>

      <div style={{ width: "97%", Maxheight:"90%"}}>
                          
        <MaterialTable
            title="Matrículas"
            data={tableData}
            columns={columns}
            components={{
              Pagination: (props) => <>
                <Divider/>
                <Grid container style={{ padding:15}}>
                  <Grid sm={6} item><Typography variant="h6">Monto total:</Typography></Grid>
                  <Grid sm={6} item align="center"><Typography variant="h6" >S/.{summaryData}.00</Typography></Grid>
                </Grid>
                <Divider/>
                <TablePagination {...props} />
              </>
            }}
        />
      </div>
    </>
  )
}
