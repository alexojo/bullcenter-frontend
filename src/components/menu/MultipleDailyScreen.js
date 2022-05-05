import MaterialTable from 'material-table';
import { TablePagination, Grid, Typography, Divider } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { listarMatriculas } from '../api/apiCore';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import esLocale from 'date-fns/locale/es'
import { useForm } from '../../hooks/useForm';

export const MultipleDailyScreen = () => {

    const [tableData, setTableData] = useState([])
    const [montoData, setMontoData] = useState(0)
    const [deudaData, setDeudaData] = useState(0)
    // FECHA DEL DIA ACTUAL
    let d = new Date();
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

    let fechainicial = ye.toString() + "-" + mo.toString() + "-" + da.toString();
    let fechafinal   = ye.toString() + "-" + mo.toString() + "-" + da.toString();

    const [ formValues, handleInputChange ] = useForm({
        date1: fechainicial,
        date2: fechafinal
    });

    const { date1, date2 } = formValues;

    //DATOS DE TABLA
    const columns = [
        { title: "Boleta", field: "boleta" },
        { title: "Matriculado por", field: "encargadoMatricula" },
        { title: "Miembro", field: "matriculado" },
        { title: "Meses", field: 'tiempoMatricula' },
        { title: "Monto", field: 'monto' },
        { title: "Deuda", field: 'deuda'}
    ]

    const ListarMatriculasHoy = (fecha) =>{
        listarMatriculas()
        .then(resp=> {
    
          var table = [];
          const matriculas = [...new Set(resp)];
    
          for (var i = 0 ; i < matriculas.length; i ++ ){

            let fecha_matricula = matriculas[i].fechaMatricula.substring(0,10).split('-');
            fecha_matricula = new Date(fecha_matricula[0], fecha_matricula[1]-1, fecha_matricula[2]);

            let fecha_inicial = date1.split('-');
            fecha_inicial = new Date(fecha_inicial[0], fecha_inicial[1]-1, fecha_inicial[2]);
            //-- FECHA FINAL
            let fecha_final = date2.split('-');
            fecha_final = new Date(fecha_final[0], fecha_final[1]-1, fecha_final[2]);
    
            if(fecha_matricula >= fecha_inicial && fecha_matricula <= fecha_final){
                
                console.log(matriculas[i].fechaMatricula.substring(0,10))
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
          for (var j = 0 ; j < table.length; j ++ ){
            total = total + table[j].monto;
            deudas = deudas + table[j].deuda;
          }
          setMontoData(total)
          setDeudaData(deudas)
        })
      }
    
    
      // CARGAR TABLA
      useEffect(()=>{
        ListarMatriculasHoy(date2)
    
      },[date1, date2])  

    return (

        <>
        <div className = "menu__title">
            RESUMEN DEL MES
        </div>

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

        <div style={{ width: "97%", Maxheight:"90%"}}>
                            
            <MaterialTable
                title="Matrículas"
                data={tableData}
                columns={columns}
                components={{
                Pagination: (props) => <>
                    <Divider/>
                    <Grid container style={{ padding:15}}>
                    <Grid sm={6} item>
                        <Typography variant="h6" >Monto:</Typography>
                        <Typography variant="h6" style={{color: 'red'}}>Deuda:</Typography>
                        <Divider/>
                        <Typography variant="h6">Monto Total:</Typography>
                    </Grid>
                    <Grid sm={6} item align="center">
                        <Typography variant="h6" >  S/.{montoData}.00</Typography>
                        <Typography variant="h6" style={{color: 'red'}}>- S/.{deudaData}.00</Typography>
                        <Divider/>
                        <Typography variant="h6" >S/.{montoData - deudaData}.00</Typography>
                        </Grid>
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
