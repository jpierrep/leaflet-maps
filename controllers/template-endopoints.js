'use strict'

const fs = require('fs');

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

function getMatrices(idMatriz,parameter){

  let  urlBase=''
  let base=''

  if (idMatriz==1){
    urlBase="http://192.168.100.141/TouchServer/embed.html#vfs://Global/Auditorias/"
     base=    [
      {id:1, nombre:"kpi",paneles:['Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20actual.xview','Paneles%20CIC/G7/Panel%20global-vista-General%20ponderado%20mes%20anterior.xview']}
      ,{id:4, nombre:"accion inmediata",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview','Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20auditoria%20mas%20de%201%20mes.xview'
    ,'Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20visita%20mas%20de%201%20mes.xview','Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Ausencias%20sin%20Justificacion.xview',
    'Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Problemas%20Coberturas.xview']}
      ,{id:5, nombre:"dotaciones",paneles:['Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20cotizacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sin%20dotacion%20real.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-sobredotacion.xview','Paneles%20CIC/G5/Dotaciones%20Vendidas%20y%20Reales%20por%20Cliente-Base%20Cotizaciones-Sistema%20Asistencias-subdotacion.xview']}
      
      ,{id:7, nombre:"cumplimiento visitas planificadas",paneles:['Paneles%20CIC/G6/cumpl%20visitas%20planificadas%20ultimos%202%20meses.xview','Paneles%20CIC/G6/cumpl%20auditorias%20planificadas%20ultimos%202%20meses.xview']}
    
      ,{id:8, nombre:"visitas y auditorias",paneles:['Paneles%20CIC/G4/Cumplimiento-Visitas-Mes-Anterior-y-Actual%20(sin%20det).xview','Paneles%20CIC/G4/Cumplimiento%20visitas%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Cumplimiento-Auditorias-Mes-Anterior-y-Actual.xview','Paneles%20CIC/G4/Cumplimiento%20auditorias%20por%20supervisor%20mes%20actual.xview','Paneles%20CIC/G4/Plantas%20sin%20visita%201%20mes.xview']}
      ,{id:9, nombre:"asistencias",paneles:['Paneles%20CIC/G3/Porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/Detalle%20porc%20horas%20extras%20comparacion%20mes%20anterior.xview','Paneles%20CIC/G3/turnos%20por%20confirmar%20por%20motivo-%20Grafico.xview','Paneles%20CIC/G3/Ausencias-Sin-Justificacion-por%20supervisor.xview','Paneles%20CIC/G3/Ranking%20Ausencias-Sin-Justificacion-Instalaciones.xview']}
    
    ]



   


  }else if(idMatriz==2){

//let file= fs.readFileSync('./config/activeTemplate.json','utf8')
//console.log('file',file)


//urlBase="http://192.168.100.141/TouchServer/embed.html##OPER1?cenco1codi=962-000"
urlBase="http://192.168.100.141/TouchServer/embed.html##" 
 base=[
  {id:1, nombre:"kpi",paneles:['OPERCLIENTE1?cenco1codi='+parameter]}
  ,{id:4, nombre:"acreditacion",paneles:['OPERCLIENTE2?cenco1codi='+parameter]}
  ,{id:5, nombre:"dotaciones",paneles:['OPERCLIENTE3?cenco1codi='+parameter]}
  
  ,{id:7, nombre:"No conformidades",paneles:['OPERCLIENTE4?cenco1codi='+parameter]}
  ,{id:8, nombre:"visitas y auditorias",paneles:['OPERCLIENTE5?cenco1codi='+parameter]}
  ,{id:9, nombre:"asistencias",paneles:['OPERCLIENTE6?cenco1codi='+parameter]}

]


  }else if(idMatriz==3){

    urlBase="http://192.168.100.141/TouchServer/embed.html##" 
     base=[
      {id:1, nombre:"kpi",paneles:['OPERSUPERVISOR1?supervisor='+parameter]}
      ,{id:4, nombre:"acreditacion",paneles:['OPERSUPERVISOR2?supervisor='+parameter]}
      ,{id:5, nombre:"dotaciones",paneles:['OPERSUPERVISOR3?supervisor='+parameter]}
      
      ,{id:7, nombre:"No conformidades",paneles:['OPERSUPERVISOR4?supervisor='+parameter]}
      ,{id:8, nombre:"visitas y auditorias",paneles:['OPERSUPERVISOR5?supervisor='+parameter]}
      ,{id:9, nombre:"asistencias",paneles:['OPERSUPERVISOR6?supervisor='+parameter]}
    
    ]

  }else if(idMatriz==4){

    //accion inmediata
    

  urlBase="http://192.168.100.141/TouchServer/embed.html##" 
   base=[
    {id:1, nombre:"kpi",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview']}
    ,{id:4, nombre:"acreditacion",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20auditoria%20mas%20de%201%20mes.xview']}
    ,{id:5, nombre:"dotaciones",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Instalaciones%20sin%20visita%20mas%20de%201%20mes.xview']}
    
    ,{id:7, nombre:"No conformidades",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Ausencias%20sin%20Justificacion.xview']}
    ,{id:8, nombre:"visitas y auditorias",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Ranking%20Problemas%20Coberturas.xview']}
    ,{id:9, nombre:"asistencias",paneles:['Paneles%20CIC/ACCION-INMEDIATA/Cert%20Vencidos%20Ranking.xview']}
  
  ]

}else if(idMatriz==5){
  //jefe operaciones
  
  urlBase="http://192.168.100.141/TouchServer/embed.html##" 
   base=[
    {id:1, nombre:"kpi",paneles:['OPERSUPERVISOR1?supervisor='+parameter]}
    ,{id:4, nombre:"acreditacion",paneles:['OPERSUPERVISOR2?supervisor='+parameter]}
    ,{id:5, nombre:"dotaciones",paneles:['OPERSUPERVISOR3?supervisor='+parameter]}
    
    ,{id:7, nombre:"No conformidades",paneles:['OPERSUPERVISOR4?supervisor='+parameter]}
    ,{id:8, nombre:"visitas y auditorias",paneles:['OPERSUPERVISOR5?supervisor='+parameter]}
    ,{id:9, nombre:"asistencias",paneles:['OPERSUPERVISOR6?supervisor='+parameter]}
  
  ]

}


  //se añade url base
base= base.map(pantalla=>{
  pantalla["paneles"]=pantalla["paneles"].map(panel=>{
    return urlBase+panel
  })
  return pantalla
  })
  
  
  
  return base

}


function getTemplateEndpointsTargit(id){

   
   

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

let file= JSON.parse(fs.readFileSync('./config/activeTemplate.json','utf8'))
console.log('file',file)

let idMatriz=file.id
let parameter=file.parameter

//id Matriz- tiene el id matriz a obtener
//parameter tiene el filtro (centro costo, nombre, etc)

let panelesTargit=getMatrices(idMatriz,parameter)


let plantilla_endpoints=JSON.parse(JSON.stringify(plantilla))

let plantilla_websites=JSON.parse(JSON.stringify(plantilla_endpoints.websites[0]))  
let websites=[]
   panelesTargit.find(x=>x.id==id)["paneles"].forEach(panel => {
    let website=JSON.parse(JSON.stringify(plantilla_websites))
    website["url"]=panel
    websites.push(website)

   })
   plantilla_endpoints["websites"]=websites

   return plantilla_endpoints

}



function getTemplateEndpoints(tipo,listadoSupervisores){

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








module.exports={getTemplateEndpoints,getTemplateEndpointsTargit}



