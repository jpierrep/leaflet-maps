'use strict'

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




function getTemplateEndpointsTargit(id){
let urlBase="http://192.168.100.141/TouchServer/embed.html#vfs://Personal"
//partir desde 3 luego actualizar endpoint para que todo se maneje desde aca
let panelesTargit=[
  {id:3, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:4, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:5, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:6, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:7, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:8, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}
  ,{id:9, nombre:"acreditacion",paneles:['Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview','Paneles%20CIC/G1/Rango%20vencimiento-graficos.xview','Paneles%20CIC/G1/Rango%20vencimiento-listado.xview','Paneles%20CIC/G1/Vencidos-graficos.xview','Paneles%20CIC/G1/Vencido-listado.xview','Paneles%20CIC/G1/Credenciales-graficos.xview','Paneles%20CIC/G1/Credenciales-listado.xview']}

]

let plantilla_endpoints=JSON.parse(JSON.stringify(plantilla))

let plantilla_websites=JSON.parse(JSON.stringify(plantilla_endpoints.websites[0]))  
let websites=[]
   panelesTargit.find(x=>x.id==id)["paneles"].forEach(panel => {
    let website=JSON.parse(JSON.stringify(plantilla_websites))
    website["url"]=urlBase+"/"+panel
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



