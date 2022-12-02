import Axios from 'axios'

export const signin = usuario => {
    //console.log("login",usuario)
    return fetch(`https://sector33-backend.vercel.app/api/auth/login`,{
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Authorization' : 'Bearer asd123asd123'
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        //console.log(response)
        return response.json()
    })
    .catch(err => {
        console.log(err)
    })
}

export const autenticacion = (data) => {
    if(typeof window !== "undefined"){
        localStorage.setItem('jwt',JSON.stringify(data))
        //console.log("autenticado")
    }
}

export const estaAutenticado = () => {
    if(typeof window == 'undefined'){
        return false
    }
    if (localStorage.getItem('jwt')){
        // return JSON.parse(localStorage.getItem('jwt'))
        return true
    } else {
        return false
    }
}

export const signout = (next) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt')
    }
}

export const crearUsuario = (usuario) => {
    //("aa",usuario)
    return fetch("https://sector33-backend.vercel.app/api/auth/create",{
        method: "POST",
        mode: "cors",
        body: JSON.stringify(usuario),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(response=>{
        //console.log("El usuario ha sido creado satisfactoriamente")
        return response.json()
    })
    .catch(err=>{
        //console.log("El usuario no se pudo crear")
        //console.log(err)
    })
}

export const crearMiembro = (usuario) => {
    //console.log("aa",usuario)
    return Axios.post("https://sector33-backend.vercel.app/api/auth/signup",{
        nombre: usuario.nombre, 
        dni: usuario.dni, 
        peso: usuario.peso,
        celular: usuario.celular
    })
}

export const read = (dni) => {
    return fetch(`https://sector33-backend.vercel.app/api/auth/${dni}`,{
        method: "GET",
    }).then(response => {
        const responseJson = response.json()
        return responseJson
    })
    .catch(err => console.log(err))
}

export const read_aux = (dni, fechaMatricula, tiempoMatricula) => {
    return fetch(`https://sector33-backend.vercel.app/api/auth/${dni}`,{
        method: "GET",
    }).then(response => {
        const responseJson = response.json()
        return responseJson
    })
    .catch(err => console.log(err))
}

export const crearMatricula = (matricula) => {
    console.log("matricula", matricula)
    return fetch("https://sector33-backend.vercel.app/api/mat/register",{
        method: "POST",
        body: JSON.stringify(matricula),
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(response=>{
        console.log("El usuario ha sido matriculado")
        return response.json()
    })
    .catch(err=>{
        console.log("El usuario no se pudo matricular")
        console.log(err)
    })
}

export const actualizarMiembro = (usuario,dni) => {
    return Axios.put(`https://sector33-backend.vercel.app/api/auth/${dni}`,{
        nombre: usuario.nombre, 
        dni: usuario.dni,
        peso: usuario.peso,
        celular: usuario.celular,
        diasDisponibles: usuario.diasDisponibles,
        fechaVencimiento: usuario.fechaVencimiento,
        fechaInicio: usuario.fechaInicio,
        deuda: usuario.deuda
    })
}

export const registrarAsistencia = (usuario,dni) => {
    return Axios.put(`https://sector33-backend.vercel.app/api/auth/registroas/${dni}`,{
        dni: usuario.dni,
        diasAsistidos: usuario.diasAsistidos
    })
}

export const listarUsuarios = () => {
    return fetch("https://sector33-backend.vercel.app/api/auth/users",{
        method: "GET",
    }).then(response => {
        const responseJson = response.json()
        return responseJson
    })
    .catch(err => console.log(err))
}

export const listarMatriculas = () => {
    return fetch("https://sector33-backend.vercel.app/api/mat/list",{
        method: "GET",
    }).then(response => {
        const responseJson = response.json()
        return responseJson
    })
    .catch(err => console.log(err))
}

export const listarMatriculas2 = (indice) => {
    return fetch("https://sector33-backend.vercel.app/api/mat/list",{
        method: "GET",
    }).then(response => {
        const responseJson = response.json()
        return responseJson
    })
    .catch(err => console.log(err))
}

export const eliminarMiembro = (dni) => {
    return Axios.delete(`https://sector33-backend.vercel.app/api/auth/${dni}`)
}

export const eliminarMatricula = (id) => {
    return Axios.delete(`https://sector33-backend.vercel.app/api/mat/remove/${id}`)
}