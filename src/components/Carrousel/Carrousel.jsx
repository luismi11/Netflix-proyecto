import './Carrousel.css'
import { useState , useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
 
export const Carrousel = ( { tipoFiltro , filtro } ) => {
    // URL DE LA API QUE CONECTA LA BBDD CON LA APP
    const url = 'https://netflix-api-gamma.vercel.app' || 'http://localhost:4000'
    const [ contenido , setContenido ] = useState([])

    // FETCH PARA LLAMAR A TODO EL CONTENIDO 
    useEffect( () => {
        let controller = new AbortController()
        let options = {
            method : "get",
            signal : controller.signal,
            headers : {
                "Content-type" : "application/json"
            }
        }
        fetch(`${url}/contenido` , options )
        .then(res => res.json())
        .then( data => setContenido( data.netflixData )) 
        .catch( err => console.log( err ))
        .finally( () => controller.abort() )

    } , [] )

    return( 
        <div className='Carrousel'>
           <Contenedor contenido={ contenido } tipoFiltro={tipoFiltro} filtro={ filtro } />
        </div>
    )
}
// COMPONENTE CONTENEDOR DEL CARRUSEL QUE RECIBE LOS FILTROS
const Contenedor = ( { contenido , filtro , tipoFiltro } ) => {

    const [ filtrar , setFiltrar ] = useState([])
    useEffect(()=>{
        const buscar = contenido.filter( eachContenido => eachContenido[tipoFiltro] === filtro )
        setFiltrar( buscar )
    } , [contenido])

    return (
        <div className='Carrousel-contenedor'>
            <h2 className='Carrousel-h2'>{ filtro }</h2> 
            <div className='Carrousel-grid'>
                { filtrar && filtrar.map( eachContenido => 
                    <Article key={ eachContenido._id} { ...eachContenido }/>
                )}
        </div>
    </div>
    )
}
// COMPONENTE DE CADA ELEMENTO INDIVIDUAL DEL CARRUSEL, RECIBE LOS DETALLES INDIVIDUALES.
const Article = ( { _id , titulo , duracion , anho , temporadas , genero , img  } ) => {

    const navigate = useNavigate()
    // FUNCION QUE NAVEGA A REPRODUCIR SEGUN CADA CONTENIDO, ENVIA UN _ID
    const playHandler = ( _id ) => {
        navigate(`/reproducir/${ _id }`)
        console.log( _id )
    }
    //FUNCIONES Y STATE PARA ACTIVAR Y DESACTIVAR LA INFO DE CADA ARTICULO DEL CARRUSEL
    const [ infoActiva , setInfoActiva ] = useState(false)

    const infoHandler = ( ) => {
        setInfoActiva(!infoActiva)
    }
    const cancelHandler =( ) => {
        setInfoActiva(false)
    }
    
    return(
        <div className='Contenedor-position' onPointerLeave={ cancelHandler } >
            <article key= { _id } className={`Carrousel-article ${ infoActiva ? 'ArticleActive': '' }`}>
                <div
                onClick={ infoHandler }
                className={`Article-portada ${ infoActiva ? 'infoActiva': '' }`}>
                    <img className={`Article-img ${ infoActiva ? 'infoActiva': '' }`} src={ img.src } alt={ img.alt }  />
                </div>
                
                <div className={`Article-informacion ${ infoActiva ? 'infoActiva': '' }`}>
                    <div className='Article-botones'>
                        <div className='Article-playbtn'>
                            <button onPointerDown={ () => playHandler(_id) } className='Article-btn'>
                            <img className="Article-img" src="/assets/play.svg" alt="Boton play"  />
                            </button>
                            <button className='Article-btn'>
                                <img className="Article-img" src="/assets/anadirlista.svg" alt=""  />
                            </button>
                        </div>
                        <button className='Article-btn'>
                            <img className="Article-img" src="/assets/pulgarvacio.svg" alt=""  />
                        </button>
                    </div>
                    <h2 className="Article-h2" > { titulo } </h2>
                    <h3 className="Article-h3" > { anho } | { duracion && duracion } { temporadas && `${temporadas} temporadas` } </h3>
                    <h4 className="Article-h4" > { genero } </h4>
                </div>
            </article>
        </div>
    )
}