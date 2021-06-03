'use strict'

var bodyParser = require('body-parser')
var express=require("express");

var app=express();
var path=require('path');
var sql = require("mssql");
var stringify = require('json-stringify');
const plantilla_websites = require('./controllers/template-endopoints');
const fs = require('fs');

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};

app.set("view engine","jade");
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false,limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'})); // transforma los datos de la peticion a json

app.get("/testView", function (req, res) {
  console.log("he")



  res.render("test.ejs", { hola: "hola" });
})



//actualiza filtro parametro
app.post("/actualizaFiltroMatriz", async function (req, res) {
  console.log("actualiza matriz")
//  fs.writeFileSync('test.json',JSON.stringify(JSON.parse(req)))

let matriz=req.body.matrizConfig
//{"matrizConfig":{"id":2,"parameter":"165-000"}}

//let matriz={"id":2,"parameter":"090-000"}
console.log (matriz)
let data=JSON.stringify(matriz)

fs.writeFileSync('config/activeTemplate.json',data)

res.status(200).send({status:"ok"});



  

})


app.get("/testViewMatriz", async function (req, res) {
  console.log("he")

  let dataMap=await getInfoCentroCosto()

  let distinctClientes=getUniqueProp(dataMap,'CENCO1_DESC')
  let clientes= distinctClientes.map(cliente=>{
    let codi=dataMap.find(x=>x['CENCO1_DESC']==cliente)['CENCO1_CODI']
    return {CODI:codi,VALUE:cliente,LABEL:cliente+' '+codi}

  })

  let distinctSupervisores=getUniqueProp(dataMap,'administrativo_nombre')
  let supervisores= distinctSupervisores.filter(x=>x!=null) .map(supervisor=>{
    let codi=dataMap.find(x=>x['administrativo_nombre']==supervisor)['administrativo_id']
    
    return {CODI:supervisor.replace(/ /g, "%20"),VALUE:supervisor,LABEL:supervisor+' '+codi}

  })

  let distinctJefeOperaciones=getUniqueProp(dataMap,'jefe_operaciones')
  let jefesOperaciones= distinctJefeOperaciones.filter(x=>x!=null) .map(jefe=>{

    
    return {CODI:jefe.replace(/ /g, "%20"),VALUE:jefe,LABEL:jefe}

  })

console.log(clientes)
console.log(supervisores)


  res.render("control-matriz-reportes.ejs", { CLIENTES: clientes,SUPERVISORES:supervisores,JEFES_OPERACIONES:jefesOperaciones });
})


app.get("/no-conformidades/supervisor/:id",async  function (req, res) {
 
  console.log("he")
  console.log("id",req.params.id)
let dataMap=await getDataNCSupervisor(req.params.id)

let supervisor_nombre=getUniqueProp(dataMap,'administrativo_nombre')
let supervisor_zona=getUniqueProp(dataMap,'zona_nombre').join(', ');
let supervisor_id=req.params.id
let infoSupervisor={supervisor_zona:supervisor_zona,supervisor_nombre:supervisor_nombre,supervisor_id:supervisor_id,data_instalaciones:dataMap}

//console.log(dataMap)
var geoJSON= createGeoJSON(dataMap);
console.log(geoJSON)

  res.render("no-conformidades.ejs", { geoJSON:geoJSON,infoSupervisor:infoSupervisor });
})


/******************** */
app.get("/visitas-pendientes/supervisor/:id",async  function (req, res) {
 
  console.log("he")
  console.log("id",req.params.id)
  //data visitas pendientes para cluster
let dataMap=await getVisitasPendientes(req.params.id)
//data para tabla
let dataNCSupervisor=await getDataNCSupervisor(req.params.id)
let supervisor_nombre=getUniqueProp(dataNCSupervisor,'administrativo_nombre')
let supervisor_zona=getUniqueProp(dataNCSupervisor,'zona_nombre').join(', ');
let supervisor_id=req.params.id
let infoSupervisor={supervisor_zona:supervisor_zona,supervisor_nombre:supervisor_nombre,supervisor_id:supervisor_id,data_instalaciones:dataMap,dataNCSupervisor:dataNCSupervisor}



let plantasGeoJSON= dataNCSupervisor.map(element=>{
  return {"type":"Feature",

  "geometry": {
  "type": "Point",
  "coordinates": [element.longitude,element.latitude],


  }
  ,"properties": {
 
      "Group":"a","name":element.planta_nombre,"cenco2_codi":element.cencos_codigo
  ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
}
  };

});


let geoJSON= dataMap.map(element=>{
  return {"type":"Feature",

  "geometry": {
  "type": "Point",
  "coordinates": [element.longitude,element.latitude],


  }
  ,"properties": {
 
      "Group":"a","name":element.planta_nombre,"cenco2_codi":element.cencos_codigo
  ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
  ,"fecha_visita_pendiente":element.FECHA 
}
  };

});
console.log(geoJSON)

  res.render("visitas-pendientes.ejs", { geoJSON:geoJSON,infoSupervisor:infoSupervisor,plantasGeoJSON:plantasGeoJSON });
})





app.get("/tiempo-planta/supervisor/:id",async  function (req, res) {
 
  console.log("he")
  console.log("id",req.params.id)
let dataMap=await getDataTiempoPlantaSupervisor(req.params.id)
let max_duracion=Math.max(...dataMap.map(x=>parseFloat(x["DURACION"])))

let supervisor_nombre=getUniqueProp(dataMap,'administrativo_nombre')
let supervisor_zona=getUniqueProp(dataMap,'zona_nombre').join(', ');
let supervisor_id=req.params.id
let infoSupervisor={supervisor_zona:supervisor_zona,supervisor_nombre:supervisor_nombre,supervisor_id:supervisor_id,data_instalaciones:dataMap,max_duracion:max_duracion}

//console.log(dataMap)
//var geoJSON= createGeoJSON(dataMap);

let geoJSON= dataMap.map(element=>{
  return {"type":"Feature",

  "geometry": {
  "type": "Point",
  "coordinates": [element.longitude,element.latitude],

  }
  ,"properties": {
 
      "Group":"a","name":element.planta_nombre,"cenco2_codi":element.cencos_codigo
  ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
  ,"DURACION":element.DURACION,"CANT_AUDITORIAS":element.CANT_AUDITORIAS ,"CANT_VISITAS":element.CANT_VISITAS 
}
  };

});
console.log(geoJSON)

  res.render("tiempo-planta.ejs", { geoJSON:geoJSON,infoSupervisor:infoSupervisor });
})


app.get("/nc-pendientes/supervisor/:id",async  function (req, res) {
 
  console.log("he")
  console.log("id",req.params.id)
  let supervisor_id=req.params.id
  //data todas las no conformidades pendientes para agrupar en el mapa
let dataMap=await getNCPendientes(req.params.id) 
//data para mostrar en tabla
let dataNCSupervisor=await getDataNCSupervisor(req.params.id)

//data de todas las plantas para añadir pin e info si fuese necesario
let dataPlantas=(await getPlantas()).filter(x=>x["administrativo_id"]==supervisor_id)

let supervisor_nombre=getUniqueProp(dataPlantas,'administrativo_nombre')
let supervisor_zona=getUniqueProp(dataPlantas,'zona_nombre').join(', ');
console.log(supervisor_nombre,supervisor_zona)

let infoSupervisor={supervisor_zona:supervisor_zona,supervisor_nombre:supervisor_nombre,supervisor_id:supervisor_id,data_instalaciones:dataMap,dataNCSupervisor:dataNCSupervisor}

//console.log(dataMap)
//var geoJSON= createGeoJSON(dataMap);
//console.log(infoSupervisor)


let plantasGeoJSON= dataPlantas.map(element=>{
  return {"type":"Feature",

  "geometry": {
  "type": "Point",
  "coordinates": [element.longitude,element.latitude],


  }
  ,"properties": {
 
      "Group":"a","name":element.nombre,"cenco2_codi":element.cenco2_codi
  ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
}
  };

});

let geoJSON= dataMap.map(element=>{
  return {"type":"Feature",

  "geometry": {
  "type": "Point",
  "coordinates": [element.longitude,element.latitude],


  }
  ,"properties": {
 
      "Group":"a","name":element.planta_nombre,"cenco2_codi":element.cencos_codigo
  ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
  ,"MAT_DESC":element.MAT_DESC,"FECHA_VISITA":element.FECHA_VISITA
  ,"5055":element.FECHA_VISITA
  ,"5065":element.MAT_ID //otro
  ,"5074":element.MAT_ID //categoria
}
  };



});
//console.log(geoJSON)



let lookupCAtegory={
  name:"materia_id"
  ,lookup:{
  
   "7":	"Certificacion.",
   "8":	"Laboral.",
   "9":"Logistica.",
   "10":	"Operaciones.",
   "11":	"Prevención Riesgos.",
   "12":	"Comercial.",
  }

 }

 let lookupOtro={
   name:"otro"
   ,lookup:{
   
    "7":	"Certificacion.",
    "8":	"Laboral.",
    "9":"Logistica.",
    "10":	"Operaciones.",
    "11":	"Prevención Riesgos.",
    "12":	"Comercial.",
   }

  }

 geoJSON={type:"FeatureCollection",features:geoJSON}

geoJSON["properties"]={"fields":{
  "5055":{name:"Date"},
  "5065":lookupOtro,
  "5074":lookupCAtegory
}
}

let data = JSON.stringify(geoJSON);
//escribe para prueba del json
fs.writeFileSync('testData.json', data);
  res.render("nc-pendientes.ejs", { geoJSON:geoJSON,infoSupervisor:infoSupervisor,plantasGeoJSON:plantasGeoJSON});
})



app.get("/plantilla-websites/:tipo",async  function (req, res) {

  let tipoMapa=req.params.tipo
  let plantas= await getPlantas()
  var  id_supervisores=  plantas.map(value=>{
    return value.administrativo_id;
  });
  var distinctSupervisores=getUnique(id_supervisores);
  console.log(distinctSupervisores)
  let plantilla=plantilla_websites.getTemplateEndpoints(tipoMapa,distinctSupervisores)
res.status(200).send(plantilla);
})


app.get("/pantalla/:id",async  function (req, res) {
  let plantilla
  let tipoMapa=""
  if (req.params.id==2||req.params.id==3||req.params.id==6){
    if (req.params.id==2)
    tipoMapa="tiempo-planta"
    else if (req.params.id==3)
    tipoMapa="nc-pendientes"
  else  tipoMapa="visitas-pendientes"

  let plantas= await getPlantas()
  var  id_supervisores=  plantas.map(value=>{
    return value.administrativo_id;
  });
  var distinctSupervisores=getUnique(id_supervisores);
  console.log(distinctSupervisores)
  plantilla=plantilla_websites.getTemplateEndpoints(tipoMapa,distinctSupervisores)
}else{
  plantilla=plantilla_websites.getTemplateEndpointsTargit(req.params.id)
}

res.status(200).send(plantilla);
})





app.get("/",function(req,res){
 
    var variable="variableeeee";
    var options=["a","b","c","d"];

    


    var plantas=getPlantas().then(result=>{
    //console.log(result);
  var dataResult=JSON.stringify(result);
  var geoJSON= JSON.stringify(createGeoJSON(result));
 
  var  cenco1=  result.map(value=>{
    return value.cenco1_desc;
  });

  var  supervisores=  result.map(value=>{
    return value.administrativo_nombre;
  });

  var distinctCenco1=getUnique(cenco1);
  console.log(distinctCenco1);

  var distinctSupervisores=getUnique(supervisores);
  console.log(distinctSupervisores)

   //var geoJSON=createGeoJSON(result);


   let colorArray=['#696969','#808080','#a9a9a9','#c0c0c0','#dcdcdc','#2f4f4f','#556b2f','#8b4513','#6b8e23','#a0522d','#a52a2a','#2e8b57','#228b22','#191970','#006400','#708090','#8b0000','#808000','#483d8b','#b22222','#5f9ea0','#3cb371','#bc8f8f','#663399','#008080','#b8860b','#bdb76b','#cd853f','#4682b4','#d2691e','#9acd32','#20b2aa','#cd5c5c','#00008b','#4b0082','#32cd32','#daa520','#7f007f','#8fbc8f','#b03060','#d2b48c','#66cdaa','#9932cc','#ff0000','#ff4500','#00ced1','#ff8c00','#ffa500','#ffd700','#6a5acd','#ffff00','#c71585','#0000cd','#40e0d0','#7fff00','#00ff00','#9400d3','#ba55d3','#00fa9a','#8a2be2','#00ff7f','#4169e1','#e9967a','#dc143c','#00ffff','#00bfff','#f4a460','#9370db','#0000ff','#a020f0','#f08080','#adff2f','#ff6347','#da70d6','#d8bfd8','#b0c4de','#ff7f50','#ff00ff','#1e90ff','#db7093','#f0e68c','#fa8072','#eee8aa','#ffff54','#6495ed','#dda0dd','#add8e6','#87ceeb','#ff1493','#7b68ee','#ffa07a','#afeeee','#ee82ee','#98fb98','#87cefa','#7fffd4','#ffe4b5','#ffdab9','#ff69b4','#ffc0cb','#ff69b4','#ffc0cb']

let unique = (value, index, self) => {
    return self.indexOf(value) == index;
  }

  let distinctSupervisoresId = result.map(x =>  {return x['administrativo_id'] }).filter(unique)
   console.log('supervisores',distinctSupervisoresId)
   
   var supervisoresColor=distinctSupervisoresId.map((supervisor,index)=>{return {administrativo_id:supervisor,color:colorArray[index]}})
   console.log("sup coloooorr",supervisoresColor)

  
   getResumenSupervisor().then(resultSupervisor=>{

   console.log("el result superv",resultSupervisor)
     resultSupervisor.filter(x=>x.ADMINISTRATIVO_ID).map(supervisor=>{
     supervisor.COLOR=supervisoresColor.find(x=>x.administrativo_id==supervisor.ADMINISTRATIVO_ID).color
     //supervisor.COLOR='#FF0000'
     //supervisor.DOT_VENDIDA= supervisor.DOT_VENDIDA.toFixed(2)
        return  supervisor

     })
     console.log("el sup",resultSupervisor[0])

    res.render("index",{variable:variable,opciones:options,dataResult:dataResult
        ,geoJSON:geoJSON,distinctCenco1:distinctCenco1,distinctSupervisores:distinctSupervisores,supervisoresColor:JSON.stringify(supervisoresColor)
       ,resumenSupervisor:supervisoresColor,resultSupervisor:resultSupervisor});

   })




    });
   



});


 function getUnique(data){
    let unique = (value, index, self) => {
        return self.indexOf(value) == index;
    }
    return data.filter(unique).sort(); 

 }

 function getUniqueProp(data,prop){

  data=data.map(value=>{
    return value[prop];
  });

  let unique = (value, index, self) => {
      return self.indexOf(value) == index;
  }
  return data.filter(unique).sort(); 

}

async function getPlantas(){
    let query=`SELECT [nombre],[longitude],[latitude] ,ci.CENCO1_DESC as cenco1_desc,estr.administrativo_id,estr.administrativo_nombre
    ,dot.DOT_ASIG_COTIZA as cotiza_dot_asignada,dot.DOT_VENDIDA_COTIZA as cotiza_dot_vendida,dot.PERSONAL_VIGENTE_ERP as cotiza_dot_vigente_erp
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

async function getPlantasSupervisor(idSupervisor){
  let query=`SELECT [nombre],[longitude],[latitude] ,ci.CENCO1_DESC as cenco1_desc,estr.administrativo_id,estr.administrativo_nombre
  ,dot.DOT_ASIG_COTIZA as cotiza_dot_asignada,dot.DOT_VENDIDA_COTIZA as cotiza_dot_vendida,dot.PERSONAL_VIGENTE_ERP as cotiza_dot_vigente_erp
  ,ci.CENCO2_CODI as cenco2_codi
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
      and estr.administrativo_id=`+idSupervisor+`
      order by ci.CENCO1_DESC asc
  `;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{

    
        resolve(result);

      });

  });

}


function getResumenSupervisor(){
    let query=`  select estr.ADMINISTRATIVO_ID,estr.ADMINISTRATIVO_NOMBRE,convert(decimal(6,2),sum(DOT_VENDIDA_COTIZA)) as DOT_VENDIDA,convert(decimal(6,2),sum(DOT_ASIG_COTIZA)) as DOT_ASIGNADA,sum(PERSONAL_VIGENTE_ERP) as DOT_REAL from
    [SISTEMA_CENTRAL].[dbo].[bi_dotaciones]  as dot
    left join [BI-SERVER-01].Inteligencias.dbo.VIEW_SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on estr.cencos_codigo=dot.CENCO2_CODI and dot.EMP_CODI=estr.empresa_id
  left join SISTEMA_CENTRAL.dbo.centros_costos as cc 
   on estr.empresa_id=cc.empresa_id and estr.cencos_codigo=cc.cencos_codigo
     where EMP_CODI=0 and deleted_at is null
     and 
 
   ULT_ACTUALIZACION_DATOS=(select MAX(ULT_ACTUALIZACION_DATOS) from [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] )
   and administrativo_nombre is not null and estr.cencos_codigo not like '001-%'
   group by estr.administrativo_id,estr.administrativo_nombre
    `;
    
    return new Promise(resolve=>{

        entrega_resultDB(query).then(result=>{
      
          resolve(result);

        });

    });

}

 function getDataNCSupervisor(idSupervisor){
  let query=`  
  select 
  cc.empresa_id,cc.cencos_codigo,cc.cencos_nombre,p.nombre as planta_nombre,latitude,longitude,administrativo_id,administrativo_nombre
  ,ISNULL(auditorias.cant_auditorias,0) as CANT_AUDITORIAS,ISNULL(nc_pendientes.cant_nc_pendientes,0) as CANT_NC_PENDIENTES
  ,ISNULL(nc_ult_mes.cant_nc_ult_mes,0) as CANT_NC_ULT_MES,ISNULL(nc_res_ult_mes.cant_nc_res_ult_mes,0) as CANT_NC_RES_ULT_MES
  ,zona_nombre
  ,ISNULL(visitas_pendientes.cantidad,0) as CANT_VISITAS_PENDIENTES
   ,ISNULL(visitas_realizadas.cantidad,0) as CANT_VISITAS_REALIZADAS
  from
  SISTEMA_CENTRAL.dbo.centros_costos as cc
  left join [BI-SERVER-01].Inteligencias.dbo.SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on cc.cencos_codigo=estr.cencos_codigo and cc.empresa_id=estr.empresa_id
  left join SISTEMA_CENTRAL.dbo.plantas as p on p.centro_costos_id=cc.id
  
  left join (
  --auditorias ultimos 30 dias
  SELECT 
  ID_PLANTA,count(*) as cant_auditorias
    FROM [BI-SERVER-01].[Inteligencias].[dbo].[NC_VISITAS]
    where ESTADO='completada'
    and INICIO between dateadd(dd,-30,GETDATE()) and  getdate()
    group by  ID_PLANTA) as auditorias
    on auditorias.ID_PLANTA= p.id
  left join (
  
  --nc pendientes
  SELECT ID_PLANTA,count (distinct id_nc) as cant_nc_pendientes
    FROM  [BI-SERVER-01].[Inteligencias].[dbo].[NC_NOCONFORMIDADES]
  
    where NC_ESTADO in ('pendiente')
    group by ID_PLANTA) as nc_pendientes
    on nc_pendientes.ID_PLANTA =p.id
  
    left join (
  
    --nc ingresadas ultimos 30 dias
    SELECT ID_PLANTA,count (distinct id_nc) as cant_nc_ult_mes
    FROM [BI-SERVER-01].[Inteligencias].[dbo].[NC_NOCONFORMIDADES]
    where accion='pendiente'
    and FECHA_NC_HISTORIAL between dateadd(dd,-30,GETDATE()) and  getdate()
      group by ID_PLANTA) as nc_ult_mes
     on nc_ult_mes.ID_PLANTA =p.id
  
      left join (
  
      select ID_PLANTA,count (distinct id_nc) as cant_nc_res_ult_mes
  
    FROM [Inteligencias].[dbo].[NC_NOCONFORMIDADES]
    where  FECHA_NC_HISTORIAL between dateadd(dd,-30,GETDATE()) and  getdate()
    and accion in ('Validada en terreno','Validada por jefatura','validada')
     group by ID_PLANTA) as nc_res_ult_mes
    on nc_res_ult_mes.ID_PLANTA=p.id
	left join
	(
  select planta_id,count(*) cantidad from [BI-SERVER-01].[Inteligencias].[dbo].[NC_VISITAS_PLANIFICACION]  


  where
  fecha between  dateadd(dd,-30,GETDATE()) and  getdate()
  and cumplimiento=0 
  group by planta_id) as visitas_pendientes
   on visitas_pendientes.planta_id=p.id
   left join
	(
  select planta_id,count(*) cantidad from [BI-SERVER-01].[Inteligencias].[dbo].[NC_VISITAS_PLANIFICACION]  


  where
  fecha between  dateadd(dd,-30,GETDATE()) and  getdate()
  and cumplimiento=1
  group by planta_id) as visitas_realizadas
   on visitas_realizadas.planta_id=p.id
  
  where cc.deleted_at is null and p.deleted_at is null
  and cc.empresa_id=0
  and administrativo_nombre is not null
  --centro de costo debe tener al menos 1 planta --ej cc de supervisores no tienen planta
  and p.nombre is not null
  and latitude is not null
  and administrativo_id=`+idSupervisor
  
  ;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{
    
        resolve(result);

      });

  });

}


function getDataTiempoPlantaSupervisor(idSupervisor){

  let query=`  

  select 
  cc.empresa_id,cc.cencos_codigo,cc.cencos_nombre,p.nombre as planta_nombre,latitude,longitude,administrativo_id,administrativo_nombre
  ,zona_nombre
  ,isnull(tiempo_planta.DURACION,0) as DURACION
  ,isnull(auditorias.CANT_AUDITORIAS,0) as CANT_AUDITORIAS
  ,isnull(tiempo_planta.CANT_VISITAS,0) as CANT_VISITAS
  from
  SISTEMA_CENTRAL.dbo.centros_costos as cc
  left join [BI-SERVER-01].Inteligencias.dbo.SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on cc.cencos_codigo=estr.cencos_codigo and cc.empresa_id=estr.empresa_id
  left join SISTEMA_CENTRAL.dbo.plantas as p on p.centro_costos_id=cc.id
  
    left join (
  --auditorias ultimos 30 dias
  SELECT 
  ID_PLANTA,count(*) as cant_auditorias
    FROM [BI-SERVER-01].[Inteligencias].[dbo].[NC_VISITAS]
    where ESTADO='completada'
    and INICIO between dateadd(dd,-30,GETDATE()) and  getdate()
    group by  ID_PLANTA) as auditorias
    on auditorias.ID_PLANTA=p.id
	
  


  left join (
SELECT ID_SUP,ID_PLANTA, SUM(DURACION) as DURACION,count(*) as CANT_VISITAS
  FROM [BI-SERVER-01].[Inteligencias].[dbo].NC_PRESENCIA_SUP_VISITAS
  where
   DIA_VISITA between dateadd(dd,-30,GETDATE()) and  getdate()
  -- DATEADD(MONTH, DATEDIFF(MONTH, 0, DIA_VISITA), 0)=  DATEADD(MONTH, DATEDIFF(MONTH, 0, getdate()), 0)
  group by ID_SUP,ID_PLANTA

) as tiempo_planta
    on tiempo_planta.ID_PLANTA=p.id
	and ID_SUP=estr.administrativo_id
  
  
  where cc.deleted_at is null and p.deleted_at is null
  and cc.empresa_id=0
  and administrativo_nombre is not null
  --centro de costo debe tener al menos 1 planta --ej cc de supervisores no tienen planta
  and p.nombre is not null
  and latitude is not null
  and administrativo_id=`+idSupervisor
  
  ;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{
    
        resolve(result);

      });

  });

}



function getVisitasPendientes(idSupervisor){

  let query=`  

  select 
  cc.empresa_id,cc.cencos_codigo,cc.cencos_nombre,p.nombre as planta_nombre,latitude,longitude,estr.administrativo_id,administrativo_nombre
  ,zona_nombre,visit_plani.fecha as FECHA

  from
  SISTEMA_CENTRAL.dbo.centros_costos as cc
  left join [BI-SERVER-01].Inteligencias.dbo.SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on cc.cencos_codigo=estr.cencos_codigo and cc.empresa_id=estr.empresa_id
  left join SISTEMA_CENTRAL.dbo.plantas as p on p.centro_costos_id=cc.id

  inner join 

  (select * from [BI-SERVER-01].[Inteligencias].[dbo].[NC_VISITAS_PLANIFICACION]  


  where
  fecha between  dateadd(dd,-30,GETDATE()) and  getdate()
  and cumplimiento=0 

  ) as visit_plani
   on 
  visit_plani.planta_id=p.id 

  where 
  --estr.administrativo_id=12193582
  estr.administrativo_id=`+idSupervisor
  
  ;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{
    
        resolve(result);

      });

  });

}

function getNCPendientes(idSupervisor){

  let query=`  

  select 
  cc.empresa_id,cc.cencos_codigo,cc.cencos_nombre,p.nombre as planta_nombre,latitude,longitude,administrativo_id,administrativo_nombre
  ,zona_nombre
  ,nc.FECHA_VISITA
  ,nc.MAT_DESC
  ,nc.MAT_ID
  from
  SISTEMA_CENTRAL.dbo.centros_costos as cc
  left join [BI-SERVER-01].Inteligencias.dbo.SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on cc.cencos_codigo=estr.cencos_codigo and cc.empresa_id=estr.empresa_id
  left join SISTEMA_CENTRAL.dbo.plantas as p on p.centro_costos_id=cc.id
  
    left join (
SELECT distinct --distinct porque acá también vienen los comentarios
    nc.ID_NC
	,FECHA_VISITA
     ,ID_PLANTA
	 ,mat.MAT_DESC
	 ,mat.MAT_ID
  FROM [BI-SERVER-01].[Inteligencias].[dbo].[NC_NOCONFORMIDADES] as nc
  left join NC_MATERIAS as mat
  on mat.SUBMAT_ID=nc.SUBMAT_ID
  where NC_ESTADO='pendiente'
 -- and FECHA_VISITA>= DATEadd(dd,-30,getdate())
  and mat.MAT_DESC like '%.%'
) as nc
    on nc.ID_PLANTA=p.id


  where cc.deleted_at is null and p.deleted_at is null
  and cc.empresa_id=0
  and administrativo_nombre is not null
  --centro de costo debe tener al menos 1 planta --ej cc de supervisores no tienen planta
  and p.nombre is not null
  and latitude is not null
  and FECHA_VISITA is not null
  and administrativo_id=`+idSupervisor
  
  ;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{
    
        resolve(result);

      });

  });

}

async function getInfoCentroCosto(){
  let query=` 
  SELECT  [bi_dotaciones].*,
SUBSTRING(bi_dotaciones.CENCO2_CODI,0,4)+'-000' as CENCO1_CODI
,estr.administrativo_nombre,estr.administrativo_id
,cc.CENCO1_DESC,estr.jefe_operaciones


  FROM [SISTEMA_CENTRAL].[dbo].[bi_dotaciones]

  left join [BI-SERVER-01].inteligencias.dbo.SIST_CENTRAL_ESTR_ORGANIZACION as estr
  on estr.cencos_codigo=bi_dotaciones.CENCO2_CODI and estr.empresa_id=EMP_CODI
  left join [BI-SERVER-01].Inteligencias.dbo.CENTROS_COSTO as cc
  on cc.EMP_CODI=[bi_dotaciones].EMP_CODI and cc.CENCO2_CODI collate Modern_Spanish_CI_AS=[bi_dotaciones].CENCO2_CODI


  where MES_ACTUAL_ERP=(select max(MES_ACTUAL_ERP) FROM [SISTEMA_CENTRAL].[dbo].[bi_dotaciones])

  `;
  
  return new Promise(resolve=>{

      entrega_resultDB(query).then(result=>{

    
        resolve(result);

      });

  });

}



function createGeoJSON_NC(data){


  let nuevoData=  data.map(element=>{
     return {"type":"Feature",
 
     "geometry": {
     "type": "Point",
     "coordinates": [element.longitude,element.latitude],
 
   
     }
     ,"properties": {
    
         "Group":"a","name":element.nombre,"cenco1_desc":element.cenco1_desc,"cenco2_codi":element.cenco2_codi
     ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id,"dotacion_vendida":element.cotiza_dot_vendida
     ,"dotacion_asignada":element.cotiza_dot_asignada,"dotacion_vigente":element.cotiza_dot_vigente_erp
     }
     };

 });
 return nuevoData;

}

function createGeoJSON(data){


     let nuevoData=  data.map(element=>{
        return {"type":"Feature",
    
        "geometry": {
        "type": "Point",
        "coordinates": [element.longitude,element.latitude],
    
      
        }
        ,"properties": {
       
            "Group":"a","name":element.planta_nombre,"cenco2_codi":element.cencos_codigo
        ,"administrativo_nombre":element.administrativo_nombre,"administrativo_id":element.administrativo_id
        ,"CANT_AUDITORIAS":element.CANT_AUDITORIAS,"CANT_NC_PENDIENTES":element.CANT_NC_PENDIENTES  
        ,"CANT_NC_ULT_MESES":element.CANT_NC_ULT_MESES,"CANT_NC_RES_ULT_MESES":element.CANT_NC_RES_ULT_MESES  
      }
        };

    });
    return nuevoData;

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


app.listen(8000,()=>{
    console.log("Servidor corriendo en puerto 8000")
});