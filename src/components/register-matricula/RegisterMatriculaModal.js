import React, {useEffect} from 'react'
import { useForm } from '../../hooks/useForm';
import { InputModal } from '../components/InputModal';
import { read} from '../api/apiCore';

import { RegisterMatricula, FechaHoy } from '../functions/RegistrarMatricula';
import { useSelector } from 'react-redux';
import { selectUser } from '../../reducers/authReducer';


export const RegisterMatriculaModal = ({setOpen, datos}) => {

  //--- FECHA
  const fecha_hoy  = FechaHoy();
  const usuario = datos[1];
  const user = useSelector( selectUser );

  // Recuperar datos de usuario ------------------
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

  useEffect(() => {
    read(usuario.dni)
    .then(response => {
        if (response.error){
        } else {
            setValues({
                ...formValues,
                nombre : response.nombre,
                dni : response.dni,
                peso: response.peso,
                celular: response.celular,
                fechaInicio : response.fechaInicio,
                fechaVencimiento : response.fechaVencimiento,
                buscardni : response.dni,
                deuda: response.deuda
            });
            setValues2({
                ...formValues2,
                matriculado: response._id,
            }); 
        }
    })
    .catch(err => {
    })

    
  }, [])

  const [ formValues2, handleInputChange2, setValues2 ] = useForm({
      matriculado:'',
      boleta:'',
      encargadoMatricula: user.user.nombre,
      fechaMatricula: fecha_hoy,
      tiempoMatricula: '',
      monto: ''
  });

  const { matriculado,boleta, fechaMatricula, tiempoMatricula, monto } = formValues2;

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
        ...formValues2,
        matriculado:'',
        boleta:'',
        fechaMatricula: fecha_hoy,
        tiempoMatricula: '',
        monto: ''
    });
}

  const handleMatricula = (e) => {

    let deudaTotal = deuda + montoDeuda;
    RegisterMatricula(fecha_hoy, fechaMatricula, fechaInicio, fechaVencimiento, tiempoMatricula, dni,  nombre, peso, celular,deudaTotal, formValues2, Reset);
    setOpen([false])
  }

  useEffect(() => {
    setValues({
      ...formValues,
      montoDeuda: monto - montoPagado
  });
    
  }, [monto, montoPagado])
  


  return (
    <>
      <div className="darkBG" onClick={() => setOpen(false)} />
      <div className="centered">
        <div className="modal">

          <div className="modalHeader">
            <h5 className="heading">REGISTRAR MATRÍCULA</h5>
          </div>

          <div className= "modalContent">
            <form>
              <InputModal
                  text = "nombre"
                  name = "nombre"
                  placeholder = {datos.name}
                  disabled = "disabled"
                  value = { nombre }
                  onChange = { handleInputChange  }
                  
              />
              <InputModal
                  text = "boleta"
                  name = "boleta"
                  placeholder = "Ingrese codigo de boleta"
                  value = { boleta }
                  onChange = { handleInputChange2  } 
                  autofocus="autofocus" 
              />
              <InputModal
                  autocomplete = "off"
                  name = "fechaMatricula"
                  type = "date"
                  text = "fecha de matrícula"
                  value = { fechaMatricula }
                  onChange = { handleInputChange2  } 
                  

              />
              <InputModal
                  type = "number"
                  name = "tiempoMatricula"
                  text = "tiempo de Matricula"
                  placeholder = "Ingrese tiempo a matricular"
                  value = { tiempoMatricula }
                  onChange = { handleInputChange2 } 
              />
              <InputModal
                  type = "number"
                  name = "monto"
                  text = "monto"
                  placeholder = "Ingrese monto total"
                  value = { monto }
                  onChange = { handleInputChange2  }
              />
              <InputModal
                  type = "number"
                  name = "montoPagado"
                  text = "monto pagado"
                  placeholder = "Ingrese monto pagado"
                  value = { montoPagado }
                  onChange = { handleInputChange  }
              />

              <InputModal
                  type = "number"
                  name = "montoDeuda"
                  text = "monto deuda"
                  disabled = "disabled"
                  value = { montoDeuda }
                  onChange = { handleInputChange  }
              />
</form>
          </div>

          <div className= "modalActions">
            <div className= "actionsContainer">
              <button className=" deleteBtn" onClick={() => {setOpen([false]);handleMatricula()}}>
                Registrar
              </button>
              <button
                className= "cancelBtn"
                onClick={() => setOpen([false])}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
