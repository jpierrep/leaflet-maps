'use strict'

const fs = require('fs');

// config for your database
var config = {
  user: 'targit',
  password: 'targit2015*',
  server: '192.168.100.14', 
  database: 'Inteligencias' 
};

var sql = require("mssql");


let plantilla={
	"settingsReloadIntervalMinutes": 1,
	"fullscreen": true,
	"autoStart": true,
	"websites" : [
		{
			"url" : "http://192.168.100.141/TouchServer/embed.html#vfs://Personal/Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview",
			"duration" : 60,
			"tabReloadIntervalSeconds": 900
		}
  ]
}


function getUnique(data){
  let unique = (value, index, self) => {
      return self.indexOf(value) == index;
  }
  return data.filter(unique).sort(); 

}

async function getMatrices(idMatriz,parameter){

  let urlBaseMap="http://192.168.0.158:8000/"
  let plantas= await getPlantas()


  let  urlBase=''
  let base=''

  if (idMatriz==1){


    //todos los supervisores
    var  id_supervisores=  plantas.map(value=>{
      return value.administrativo_id;
    });
    var distinctSupervisores=getUnique(id_supervisores);
    console.log(distinctSupervisores)

    let mapasTiempoPlanta=getTemplateEndpoints("tiempo-planta","supervisor",distinctSupervisores)
    let mapasNCPendientes=getTemplateEndpoints("nc-pendientes","supervisor",distinctSupervisores)
    let mapasVisitasPendientes=getTemplateEndpoints("visitas-pendientes","supervisor",distinctSupervisores)

    urlBase="http://192.168.100.141/TouchServer/embed.html#vfs://Global/Auditorias/"

     base=    [
      {id:1, nombre:"kpi",paneles:['Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20actual.xview','Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20anterior.xview']}
     
      ,{id:2, nombre:"mapa",paneles:mapasTiempoPlanta}
      ,{id:3, nombre:"mapa",paneles:mapasNCPendientes}

      ,{id:4, nombre:"accion inmediata",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview','Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20auditoria%20mas%20de%201%20mes.xview'
    ,'Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20visita%20mas%20de%201%20mes.xview','Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Ausencias%20sin%20Justificacion.xview',
    'Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Problemas%20Coberturas.xview']}
      ,{id:5, nombre:"dotaciones",paneles:['Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20cotizacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20dotacion%20real.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sobredotacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-subdotacion.xview']}
      ,{id:6, nombre:"mapa",paneles:mapasVisitasPendientes}
      ,{id:7, nombre:"cumplimiento visitas planificadas",paneles:['Paneles%20CIC/G6/cumpl%20visitas%20planificadas%20ultimos%202%20meses.xview','Paneles%20CIC/G6/cumpl%20auditorias%20planificadas%20ultimos%202%20meses.xview']}
    
      ,{id:8, nombre:"visitas y auditorias",paneles:['Paneles%20CIC/G4/Cumplimiento-Visitas-Mes-Anterior-y-Actual%20(sin%20det).xview','Paneles%20CIC/G4/Cumplimiento%20visitas%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Cumplimiento-Auditorias-Mes-Anterior-y-Actual.xview','Paneles%20CIC/G4/Cumplimiento%20auditorias%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Plantas%20sin%20visita%201%20mes.xview']}
      ,{id:9, nombre:"asistencias",paneles:['Paneles%20CIC/G3/Porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/Detalle%20porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/turnos%20por%20confirmar%20por%20motivo-%20Grafico.xview','Paneles%20CIC/G3/Ausencias-Sin-Justificacion-por%20supervisor.xview','Paneles%20CIC/G3/Ranking%20Ausencias-Sin-Justificacion-Instalaciones.xview']}
    
    ]



   


  }else if(idMatriz==2){

    //matriz cliente
 
console.log("paramenter",parameter)
let typeFilter='cenco1codi'
 //parameter={"id":2,"filter":[{"type":"cenco1codi","value":"028-000"},{"type":"sup","value":null},{"type":"jefeop","value":null}],"apertura":"supervisor" }

 let baseFilter=parameter["filterValue"].map(x=>x.type+"="+ (x.value==null?"%20":x.value)).join("&")
 let parameterFilter=parameter.filterValue.find(x=>x.type==typeFilter).value
 parameter.apertura=parameter.apertura.toUpperCase()



//urlBase="http://192.168.100.141/TouchServer/embed.html##OPER1?cenco1codi=962-000"
urlBase="http://192.168.100.141/TouchServer/embed.html##" 

 base=[
  {id:1, nombre:"kpi",paneles:['OPER'+parameter.apertura+'1?'+baseFilter,'OPER'+parameter.apertura+'1-2?'+baseFilter]}
  ,{id:2, nombre:"mapa",paneles:['tiempo-planta/cliente/'+parameterFilter]}
  ,{id:3, nombre:"mapa",paneles:['nc-pendientes/cliente/'+parameterFilter]}
  ,{id:4, nombre:"acreditacion",paneles:['OPER'+parameter.apertura+'2?'+baseFilter]}
  ,{id:5, nombre:"% visitas",paneles:['OPER'+parameter.apertura+'3?'+baseFilter]}
  ,{id:6, nombre:"% auditorias",paneles:['OPER'+parameter.apertura+'6?'+baseFilter]}
//   ,{id:6, nombre:"mapa",paneles:mapasVisitasPendientes}
,{id:7, nombre:"visitas y auditorias cumplimiento",paneles:['OPER'+parameter.apertura+'8?'+baseFilter,'OPER'+parameter.apertura+'8-2?'+baseFilter]}
  ,{id:8, nombre:"No conformidades",paneles:['OPER'+parameter.apertura+'4?'+baseFilter]}
  ,{id:9, nombre:"Turnos por confimar",paneles:['OPER'+parameter.apertura+'5?'+baseFilter]}

]


  }else if(idMatriz==3){

    //matriz supervisor
    
    let typeFilter='sup'
 //parameter={"id":2,"filter":[{"type":"cenco1codi","value":"028-000"},{"type":"sup","value":null},{"type":"jefeop","value":null}],"apertura":"supervisor" }

 let baseFilter=parameter["filterValue"].map(x=>x.type+"="+ (x.value==null?"%20":x.value)).join("&")
 let parameterFilter=parameter.filterValue.find(x=>x.type==typeFilter).value
 parameter.apertura=parameter.apertura.toUpperCase()

     //como parametro llega el nombre del supervisor, neceitamos el id para el api
   parameterFilter=plantas.find(x=>x["administrativo_nombre"]==parameterFilter.replace(/%20/g, " "))["administrativo_id"]
  // let id_supervisor=plantas.find(x=>x["administrativo_nombre"]=="Cortes Jara Alfredo")["administrativo_id"]

   //"Cortes%20Jara%20Alfredo"

    urlBase="http://192.168.100.141/TouchServer/embed.html##" 
    base=[
      {id:1, nombre:"kpi",paneles:['OPER'+parameter.apertura+'1?'+baseFilter,'OPER'+parameter.apertura+'1-2?'+baseFilter]}
      ,{id:2, nombre:"mapa",paneles:['tiempo-planta/supervisor/'+parameterFilter]}
      ,{id:3, nombre:"mapa",paneles:['nc-pendientes/supervisor/'+parameterFilter]}
      ,{id:4, nombre:"acreditacion",paneles:['OPER'+parameter.apertura+'2?'+baseFilter]}
      ,{id:5, nombre:"% visitas",paneles:['OPER'+parameter.apertura+'3?'+baseFilter]}
      ,{id:6, nombre:"% auditorias",paneles:['OPER'+parameter.apertura+'6?'+baseFilter]}
   //   ,{id:6, nombre:"mapa",paneles:mapasVisitasPendientes}
   ,{id:7, nombre:"visitas y auditorias cumplimiento",paneles:['OPER'+parameter.apertura+'8?'+baseFilter,'OPER'+parameter.apertura+'8-2?'+baseFilter]}
      ,{id:8, nombre:"No conformidades",paneles:['OPER'+parameter.apertura+'4?'+baseFilter]}
      ,{id:9, nombre:"Turnos por confimar",paneles:['OPER'+parameter.apertura+'5?'+baseFilter]}
    
    ]
    

  }else if(idMatriz==4){

      //accion inmediata

      //todos los supervisores
      var  id_supervisores=  plantas.map(value=>{
        return value.administrativo_id;
      });
      var distinctSupervisores=getUnique(id_supervisores);
      console.log(distinctSupervisores)
  
      let mapasTiempoPlanta=getTemplateEndpoints("tiempo-planta","supervisor",distinctSupervisores)
      let mapasNCPendientes=getTemplateEndpoints("nc-pendientes","supervisor",distinctSupervisores)
      let mapasVisitasPendientes=getTemplateEndpoints("visitas-pendientes","supervisor",distinctSupervisores)

  
    

  urlBase="http://192.168.100.141/TouchServer/embed.html#vfs://Global/Auditorias/"
   base=[
    {id:1, nombre:"kpi",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview']}
    ,{id:2, nombre:"mapa",paneles:mapasTiempoPlanta}
    ,{id:3, nombre:"mapa",paneles:mapasNCPendientes}
    ,{id:4, nombre:"acreditacion",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20auditoria%20mas%20de%201%20mes.xview']}
    ,{id:5, nombre:"dotaciones",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20visita%20mas%20de%201%20mes.xview']}
    ,{id:6, nombre:"mapa",paneles:mapasVisitasPendientes}
    ,{id:7, nombre:"No conformidades",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Ausencias%20sin%20Justificacion.xview']}
    ,{id:8, nombre:"visitas y auditorias",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Problemas%20Coberturas.xview']}
    ,{id:9, nombre:"asistencias",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview']}
  
  ]

}else if(idMatriz==5){
  //jefe operaciones
  

  let typeFilter='jefeop'
  //parameter={"id":2,"filter":[{"type":"cenco1codi","value":"028-000"},{"type":"sup","value":null},{"type":"jefeop","value":null}],"apertura":"supervisor" }
 
  let baseFilter=parameter["filterValue"].map(x=>x.type+"="+ (x.value==null?"%20":x.value)).join("&")
  let parameterFilter=parameter.filterValue.find(x=>x.type==typeFilter).value
  parameter.apertura=parameter.apertura.toUpperCase()

        //todos los supervisores del jefe operaciones correspondiente
        var  id_supervisores=plantas.filter(x=>x['jefe_operaciones']!=null).filter(x=>x['jefe_operaciones']==parameterFilter.replace(/%20/g, " ")) .map(value=>{
          return value.administrativo_id;
        });



        var distinctSupervisores=getUnique(id_supervisores);
        console.log("distinctSupervisores",distinctSupervisores)
    
        let mapasTiempoPlanta=getTemplateEndpoints("tiempo-planta","supervisor",distinctSupervisores)
        let mapasNCPendientes=getTemplateEndpoints("nc-pendientes","supervisor",distinctSupervisores)
        let mapasVisitasPendientes=getTemplateEndpoints("visitas-pendientes","supervisor",distinctSupervisores)

  urlBase="http://192.168.100.141/TouchServer/embed.html##" 
   
  base=[
    {id:1, nombre:"kpi",paneles:['OPER'+parameter.apertura+'1?'+baseFilter,'OPER'+parameter.apertura+'1-2?'+baseFilter]}
    ,{id:2, nombre:"mapa",paneles:mapasTiempoPlanta}
    ,{id:3, nombre:"mapa",paneles:mapasNCPendientes}
    ,{id:4, nombre:"acreditacion",paneles:['OPER'+parameter.apertura+'2?'+baseFilter]}
    ,{id:5, nombre:"% visitas",paneles:['OPER'+parameter.apertura+'3?'+baseFilter]}
    ,{id:6, nombre:"% auditorias",paneles:['OPER'+parameter.apertura+'6?'+baseFilter]}
 //   ,{id:6, nombre:"mapa",paneles:mapasVisitasPendientes}
 ,{id:7, nombre:"visitas y auditorias cumplimiento",paneles:['OPER'+parameter.apertura+'8?'+baseFilter,'OPER'+parameter.apertura+'8-2?'+baseFilter]}
    ,{id:8, nombre:"No conformidades",paneles:['OPER'+parameter.apertura+'4?'+baseFilter]}
    ,{id:9, nombre:"Turnos por confimar",paneles:['OPER'+parameter.apertura+'5?'+baseFilter]}
   
  
  ]
  

}


  //se añade url base
base= base.map(pantalla=>{
  pantalla["paneles"]=pantalla["paneles"].map(panel=>{
    if (pantalla["nombre"]!='mapa') return urlBase+panel
    else return urlBaseMap+panel
  })
  return pantalla
  })
  
  
  
  return base

}


async function getTemplateEndpointsTargit(id){

   
   console.log("el id buscado es ",id)

  /*
let urlBase="http://192.168.100.141/TouchServer/embed.html#vfs://Global/Auditorias/"
//partir desde 3 luego actualizar endpoint para que todo se maneje desde aca

//Acreditacion
//{id:4, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
//,{id:7, nombre:"No conformidades",paneles:['Paneles%20CIC/G2/No%20Conformidades%20%20ultimas%20nc%20registradas.xview','Paneles%20CIC/G2/no%20conformidades%20ultimos%2030%20dias%20estado.xview','Paneles%20CIC/G2/no%20conformidades%20ultimos%2030%20dias%20materia.xview','Paneles%20CIC/G2/no%20conformidades%20acumuladas%20tiempo%20pendiente.xview','Paneles%20CIC/G2/no%20conformidades%20cronologico%20personal.xview']}


let panelesTargit=[
  {id:1, nombre:"kpi",paneles:['Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20actual.xview','Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20anterior.xview']}
  ,{id:4, nombre:"accion inmediata",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview','Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20auditoria%20mas%20de%201%20mes.xview'
,'Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20visita%20mas%20de%201%20mes.xview','Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Ausencias%20sin%20Justificacion.xview',
'Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Problemas%20Coberturas.xview']}
  ,{id:5, nombre:"dotaciones",paneles:['Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20cotizacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20dotacion%20real.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sobredotacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-subdotacion.xview']}
  
  ,{id:7, nombre:"cumplimiento visitas planificadas",paneles:['Paneles%20CIC/G6/cumpl%20visitas%20planificadas%20ultimos%202%20meses.xview','Paneles%20CIC/G6/cumpl%20auditorias%20planificadas%20ultimos%202%20meses.xview']}

  ,{id:8, nombre:"visitas y auditorias",paneles:['Paneles%20CIC/G4/Cumplimiento-Visitas-Mes-Anterior-y-Actual%20(sin%20det).xview','Paneles%20CIC/G4/Cumplimiento%20visitas%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Cumplimiento-Auditorias-Mes-Anterior-y-Actual.xview','Paneles%20CIC/G4/Cumplimiento%20auditorias%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Plantas%20sin%20visita%201%20mes.xview']}
  ,{id:9, nombre:"asistencias",paneles:['Paneles%20CIC/G3/Porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/Detalle%20porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/turnos%20por%20confirmar%20por%20motivo-%20Grafico.xview','Paneles%20CIC/G3/Ausencias-Sin-Justificacion-por%20supervisor.xview','Paneles%20CIC/G3/Ranking%20Ausencias-Sin-Justificacion-Instalaciones.xview']}

]



*/


/*

let parameter='165-000'
//urlBase="http://192.168.100.141/TouchServer/embed.html##OPER1?cenco1codi=962-000"
let urlBase="http://192.168.100.141/TouchServer/embed.html##" 
let panelesTargit=[
  {id:1, nombre:"kpi",paneles:['OPERCLIENTE1?cenco1codi='+parameter]}
  ,{id:4, nombre:"acreditacion",paneles:['OPERCLIENTE2?cenco1codi='+parameter]}
  ,{id:5, nombre:"dotaciones",paneles:['OPERCLIENTE3?cenco1codi='+parameter]}
  
  ,{id:7, nombre:"No conformidades",paneles:['OPERCLIENTE4?cenco1codi='+parameter]}
  ,{id:8, nombre:"visitas y auditorias",paneles:['OPERCLIENTE5?cenco1codi='+parameter]}
  ,{id:9, nombre:"asistencias",paneles:['OPERCLIENTE6?cenco1codi='+parameter]}

]


*/

/*

//let parameter='Fernandez%20%20%20Cristian'
let parameter='Quintriqueo%20Valdenegro%20Lorenzo'

//urlBase="http://192.168.100.141/TouchServer/embed.html##OPER1?cenco1codi=962-000"
let urlBase="http://192.168.100.141/TouchServer/embed.html##" 
let panelesTargit=[
  {id:1, nombre:"kpi",paneles:['OPERSUPERVISOR1?supervisor='+parameter]}
  ,{id:4, nombre:"acreditacion",paneles:['OPERSUPERVISOR2?supervisor='+parameter]}
  ,{id:5, nombre:"dotaciones",paneles:['OPERSUPERVISOR3?supervisor='+parameter]}
  
  ,{id:7, nombre:"No conformidades",paneles:['OPERSUPERVISOR4?supervisor='+parameter]}
  ,{id:8, nombre:"visitas y auditorias",paneles:['OPERSUPERVISOR5?supervisor='+parameter]}
  ,{id:9, nombre:"asistencias",paneles:['OPERSUPERVISOR6?supervisor='+parameter]}

]

*/

//dimsion cliente supervisor jefe


let file= JSON.parse(fs.readFileSync('./config/activeTemplate.json','utf8'))
console.log('file',file)

let idMatriz=file.id
let parameter=file

//id Matriz- tiene el id matriz a obtener
//parameter tiene el filtro (centro costo, nombre, etc)

let panelesTargit= await getMatrices(idMatriz,parameter)
console.log("matrizesMostrar",panelesTargit)


let plantilla_endpoints=JSON.parse(JSON.stringify(plantilla))

let plantilla_websites=JSON.parse(JSON.stringify(plantilla_endpoints.websites[0]))  
let websites=[]
   panelesTargit.find(x=>x.id==id)["paneles"].forEach(panel => {
    let website=JSON.parse(JSON.stringify(plantilla_websites))
    website["url"]=panel
    websites.push(website)

   })
   plantilla_endpoints["websites"]=websites
   console.log("plantilla_enda",plantilla_endpoints)
   return plantilla_endpoints


}



function getTemplateEndpoints2(tipo,listadoSupervisores){

  let urlBase="http://192.168.0.158:8000"
  // listadoSupervisores=["14195250","14195250","14195250","14195250","14195250"];

   let plantilla_endpoints=JSON.parse(JSON.stringify(plantilla))

   let plantilla_websites=JSON.parse(JSON.stringify(plantilla_endpoints.websites[0]))

   let websites=[]
   listadoSupervisores.forEach(supervisor => {
    let website=JSON.parse(JSON.stringify(plantilla_websites))
    website["url"]=urlBase+"/"+tipo+"/supervisor/"+supervisor
    websites.push(website)
   
});

  plantilla_endpoints["websites"]=websites


  console.log(plantilla_endpoints)

  //http://192.168.0.158:8000/plantilla-websites/tiempo-planta

  return plantilla_endpoints

}

function getTemplateEndpoints(tipo,dimension,listado){
  //tipo nc, tiempo planta, visitas-pend
  //dimension-supervisor- cliente
  //listado array con clientes, supervisores


  // listadoSupervisores=["14195250","14195250","14195250","14195250","14195250"];

   

   let websites=[]
   listado.forEach(member => {
    
    websites.push(tipo+"/"+dimension+"/" +member)
   
});


  return  websites

}

async function getPlantas(){
  let query=`SELECT [nombre],[longitude],[latitude] ,ci.CENCO1_CODI as CENCO1_CODI, ci.CENCO1_DESC as cenco1_desc,estr.administrativo_id,estr.administrativo_nombre
  ,dot.DOT_ASIG_COTIZA as cotiza_dot_asignada,dot.DOT_VENDIDA_COTIZA as cotiza_dot_vendida,dot.PERSONAL_VIGENTE_ERP as cotiza_dot_vigente_erp,estr.jefe_operaciones
  ,ci.CENCO2_CODI as cenco2_codi,estr.zona_nombre
      FROM [SISTEMA_CENTRAL].[dbo].[plantas] as p left join [SISTEMA_CENTRAL].[dbo].[centros_costos] as cc
      on p.centro_costos_id=cc.id
      left join [BI-SERVER-01].Inteligencias.dbo.VIEW_CENTROS_COSTO as ci
      left join [BI-SERVER-01].Inteligencias.dbo.VIEW_SIST_CENTRAL_ESTR_ORGANIZACION as estr
      on estr.cencos_codigo=ci.CENCO2_CODI and estr.empresa_id=ci.EMP_CODI
      on ci.CENCO2_CODI=cc.cencos_codigo and ci.EMP_CODI=cc.empresa_id
    left join [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] as dot
     on dot.CENCO2_CODI=ci.CENCO2_CODI and dot.EMP_CODI=ci.EMP_CODI and dot.ULT_ACTUALIZACION_DATOS=(select MAX(ULT_ACTUALIZACION_DATOS) from [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] )
      where cc.deleted_at is null  and p.deleted_at is null and cc.empresa_id=0 
      and dot.PERSONAL_VIGENTE_ERP>0 and administrativo_id is not null
      and administrativo_id not in (16750473,6757887) --excluye patricio peñaloza y zona testing
      order by ci.CENCO1_DESC asc
  `;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{

    
        resolve(result);

      });

  });

}


function entrega_resultDB(queryDB){
  return new Promise(resolve=>{ 
  // const fruit = request.params.parame;

    // connect to your database
   sql.connect(config).then((pool)=>{
     return pool.request().query(queryDB)
   }).then(result=>{
    resolve(result);

    }).catch(err=>{
     console.log(err);
   })


   }); 



}




module.exports={getTemplateEndpoints,getTemplateEndpointsTargit}



