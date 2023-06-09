import { useEffect, useState } from 'react'
import { VideoLoading } from '../VideoLoading/VideoLoading'
import './Reproducir.css'
import { useNavigate, useParams } from 'react-router-dom'

export const Reproducir = ( ) => {
    const url = 'https://netflix-api-gamma.vercel.app' || 'http://localhost:4000'
    
    // USEPARAMS PARA RECIBIR LOS PARAMETROS ENVIADOS
    const { id } = useParams()
    
    const [ contenidoById , setContenidoById ] = useState([])
    const bannerFondo = contenidoById.banner

    const [ todoAcciones , setTodoAcciones ] = useState([])

    //DECONSTRUCCION DEL CONTENIDO RECIBIDO EN EL FETCH DE ACCIONES
    const { bandera , reproducion , opcionesRep , flechaAtras } = todoAcciones

    const navigate = useNavigate()
    const volverHandler = () => navigate("/")

    //FETCH QUE RECIBE EL CONTENIDO CON EL ID ANTES RECIBIDO EN LOS PARAMS
    useEffect( ( ) => {
        let controller = new AbortController()
        let options = {
            method : "get",
            signal : controller.signal,
            headers : {
                "Content-type" : "application/json"
            }
        }
        fetch(`${url}/contenido/id/${ id }` , options )
        .then(res => res.json())
        .then( data => setContenidoById( data.netflixData[0] ))
        .catch( err => console.log( err ))
        .finally( () => controller.abort() )
    } , [])

    //FETCH QUE RECIBE EL CONTENIDO DE ACCIONES
    useEffect( () => {
        let controller = new AbortController()
        let options = {
            method : "get",
            signal : controller.signal,
            headers : {
                "Content-type" : "application/json"
            }
        }
        fetch(`${url}/` , options )
        .then(res => res.json())
        .then( data => setTodoAcciones( data.netflixData[0] ))
        .catch( err => console.log( err ))
        .finally( () => controller.abort() )
        
    } , [])
    return( 
        <div className="Reproducir">
            <div className="Reproducir-contenedor" style = {  bannerFondo &&  { backgroundImage: `url(${ bannerFondo.src })`}}>
                <div className='Navegar-contenedor'>
                    { flechaAtras && 
                            <img onPointerDown={ volverHandler } className='Reproducir-icon' src={flechaAtras.src} alt={flechaAtras.alt} />
                    }
                    { bandera &&
                        <img className='Reproducir-icon' src={ bandera.src } alt={ bandera.alt } />
                    }
                </div >
                <div className='Video-contenedor'>
                    <VideoLoading />
                    <p className='Video-p'> Rota el dispositivo </p>
                </div>
                <div className='Info-contenedor'>
                    <ul className='Info-ul'>
                        {   reproducion && reproducion.map( ( { id , src , alt } ) => 
                            <li key={ id } ><img className='Reproducir-icon' src={ src } alt={ alt } /></li>
                        )}
                        
                    </ul>
                    <h2 className='Info-h2'> {contenidoById.titulo} </h2>
                    <ul className='Info-ul'>
                        { opcionesRep && opcionesRep.map( ({ id , src , alt}) => 
                            <li key={ id }><img className='Reproducir-icon' src={ src } alt={ alt } /></li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}