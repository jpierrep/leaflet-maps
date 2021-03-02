'use strict'

let plantilla={
	"settingsReloadIntervalMinutes": 1,
	"fullscreen": true,
	"autoStart": false,
	"websites" : [
		{
			"url" : "http://192.168.100.141/TouchServer/embed.html#vfs://Personal/Paneles%20CIC/G1/Rango%20vencimiento-proximos%20vencimientos%20detalle.xview",
			"duration" : 60,
			"tabReloadIntervalSeconds": 900
		}
  ]
}

let urlBase="http://192.168.0.158:8000"




function getTemplateEndpoints(tipo,listadoSupervisores){
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





module.exports={getTemplateEndpoints}



