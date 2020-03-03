'use strict'

var express=require("express");

var app=express();
var path=require('path');
var sql = require("mssql");
var stringify = require('json-stringify');

// config for your database
var config = {
    user: 'targit',
    password: 'targit2015*',
    server: '192.168.100.14', 
    database: 'Inteligencias' 
};

app.set("view engine","jade");
app.use(express.static('public'));

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


   let colorArray=['#696969','#808080','#a9a9a9','#c0c0c0','#dcdcdc','#2f4f4f','#556b2f','#8b4513','#6b8e23','#a0522d','#a52a2a','#2e8b57','#228b22','#191970','#006400','#708090','#8b0000','#808000','#483d8b','#b22222','#5f9ea0','#3cb371','#bc8f8f','#663399','#008080','#b8860b','#bdb76b','#cd853f','#4682b4','#d2691e','#9acd32','#20b2aa','#cd5c5c','#00008b','#4b0082','#32cd32','#daa520','#7f007f','#8fbc8f','#b03060','#d2b48c','#66cdaa','#9932cc','#ff0000','#ff4500','#00ced1','#ff8c00','#ffa500','#ffd700','#6a5acd','#ffff00','#c71585','#0000cd','#40e0d0','#7fff00','#00ff00','#9400d3','#ba55d3','#00fa9a','#8a2be2','#00ff7f','#4169e1','#e9967a','#dc143c','#00ffff','#00bfff','#f4a460','#9370db','#0000ff','#a020f0','#f08080','#adff2f','#ff6347','#da70d6','#d8bfd8','#b0c4de','#ff7f50','#ff00ff','#1e90ff','#db7093','#f0e68c','#fa8072','#eee8aa','#ffff54','#6495ed','#dda0dd','#add8e6','#87ceeb','#ff1493','#7b68ee','#ffa07a','#afeeee','#ee82ee','#98fb98','#87cefa','#7fffd4','#ffe4b5','#ffdab9','#ff69b4','#ffc0cb']

let unique = (value, index, self) => {
    return self.indexOf(value) == index;
  }

  let distinctSupervisoresId = result.map(x =>  {return x['administrativo_id'] }).filter(unique)
   console.log('supervisores',distinctSupervisoresId)
   
   var supervisoresColor=distinctSupervisoresId.map((supervisor,index)=>{return {administrativo_id:supervisor,color:colorArray[index]}})
   console.log("sup coloooorr",supervisoresColor)

  
   getResumenSupervisor().then(resultSupervisor=>{


     resultSupervisor.map(supervisor=>{
     supervisor.COLOR=supervisoresColor.find(x=>x.administrativo_id==supervisor.ADMINISTRATIVO_ID).color
     //supervisor.DOT_VENDIDA= supervisor.DOT_VENDIDA.toFixed(2)
        return  supervisor

     })
     console.log(resultSupervisor)

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

function getPlantas(){
    let query=`SELECT [nombre],[longitude],[latitude] ,ci.CENCO1_DESC as cenco1_desc,estr.administrativo_id,estr.administrativo_nombre
    ,dot.DOT_ASIG_COTIZA as cotiza_dot_asignada,dot.DOT_VENDIDA_COTIZA as cotiza_dot_vendida,dot.PERSONAL_VIGENTE_ERP as cotiza_dot_vigente_erp
    ,ci.CENCO2_CODI as cenco2_codi
        FROM [SISTEMA_CENTRAL].[dbo].[plantas] as p left join [SISTEMA_CENTRAL].[dbo].[centros_costos] as cc
        on p.centro_costos_id=cc.id
        left join Inteligencias.dbo.VIEW_CENTROS_COSTO as ci
        left join Inteligencias.dbo.VIEW_SIST_CENTRAL_ESTR_ORGANIZACION as estr
        on estr.cencos_codigo=ci.CENCO2_CODI and estr.empresa_id=ci.EMP_CODI
        on ci.CENCO2_CODI=cc.cencos_codigo and ci.EMP_CODI=cc.empresa_id
      left join [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] as dot
       on dot.CENCO2_CODI=ci.CENCO2_CODI and dot.EMP_CODI=ci.EMP_CODI and dot.ULT_ACTUALIZACION_DATOS=(select MAX(ULT_ACTUALIZACION_DATOS) from [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] )
        where cc.deleted_at is null  and p.deleted_at is null and cc.empresa_id=0 
        and dot.PERSONAL_VIGENTE_ERP>0
        order by ci.CENCO1_DESC asc
    `;
    
    return new Promise(resolve=>{

        entrega_resultDB(query).then(result=>{

            //result format
            //nombre	longitude	latitude	cenco1_desc	administrativo_id	administrativo_nombre	cotiza_dot_asignada	cotiza_dot_vendida	cotiza_dot_vigente_erp	cenco2_codi
//ACADEMIA JUDICIAL	-70,656802	-33,4383449	ACADEMIA JUDICIAL	6504661	Barria   Jorge	2	2	2	129-001
//Testing Proposal	-71,5381272	-33,0291251	ADMINISTRACION	16750473	Aldunate Allegro Ricardo	NULL	NULL	5	001-001

  //añade info especial para fiscalias

  let fiscalias=[{"Inmueble":"Fiscalia Nacion","Nombre":"Fiscalia Nacional","Direccion":"Catedral 1437","Ciudad":"Santiago","Observacion":null,"Latitud":"-33.4379906","Longitud":"-70.6596724"},{"Inmueble":"Fiscalia Nacion","Nombre":"Oficinas Auxiliares","Direccion":"Agustinas 1070","Ciudad":"Santiago","Observacion":null,"Latitud":"-33.4409564","Longitud":"-70.6539155"},{"Inmueble":"Fiscalia Nacion","Nombre":"Centro de Justicia de Santiago","Direccion":"Av. Pedro Montt 1606","Ciudad":"Santiago","Observacion":null,"Latitud":"-33.4742969","Longitud":"-70.658164"},{"Inmueble":"Fiscalia Regional Metropolitana Centro Norte","Nombre":"Fiscalia Local de Chacabuco","Direccion":"Carretera General San Martín 785","Ciudad":"Colina","Observacion":null,"Latitud":"-33.1970402","Longitud":"-70.6725855"},{"Inmueble":"Fiscalia Regional Metropolitana Centro Norte","Nombre":"Fiscalia Regional y locales del Centro Just Santiago","Direccion":"Av.  Pedro Montt 1608","Ciudad":"Santiago","Observacion":"direccion es 1606, pero se sobrepondría en mapa","Latitud":"-33.4733033","Longitud":"-70.6580416"},{"Inmueble":"Fiscalia Regional Metropolitana Oriente","Nombre":"Fiscalia Regional Metropolitana Oriente y Fiscalia Local de las Condes","Direccion":"Los Militares 5550","Ciudad":"Las Contes","Observacion":null,"Latitud":"-33.4065347","Longitud":"-70.5756499"},{"Inmueble":"Fiscalia Regional Metropolitana Oriente","Nombre":"Fiscalia Local de Ñuñoa","Direccion":"San Jorge 57","Ciudad":"Ñuñoa","Observacion":null,"Latitud":"-33.4549022","Longitud":"-70.5802279"},{"Inmueble":"Fiscalia Regional Metropolitana Oriente","Nombre":"Fiscalias Locales de La Florida, Peñalolen-Macul y de Delitos Flagrantes y Primeras Diligencias","Direccion":"Av. Americo Vespucio 6800","Ciudad":"La Florida","Observacion":null,"Latitud":"-33.5170109","Longitud":"-70.5957858"},{"Inmueble":"Fiscalia Regional Metropolitana Sur","Nombre":"Fiscalia Regional y Fiscalias Locales (Edificio Copper)","Direccion":"Gran Avenida José Miguel Carrega 3814","Ciudad":"San Miguel","Observacion":null,"Latitud":"-33.4891833","Longitud":"-70.6529686"},{"Inmueble":"Fiscalia Regional Metropolitana Sur","Nombre":"Fiscalia Regional (Unidad Especializada)","Direccion":"Gran Avenida José Miguel Carrega 3840","Ciudad":"San Miguel","Observacion":null,"Latitud":"-33.4894214","Longitud":"-70.6528432"},{"Inmueble":"Fiscalia Regional Metropolitana Sur","Nombre":"Fiscalia Regional y Fiscalias Locales (Edificio Pirámide)","Direccion":"Piramide 1076","Ciudad":"San MIguel","Observacion":"Edificio Piramide","Latitud":"-33.5013517","Longitud":"-70.6551632"},{"Inmueble":"Fiscalia Regional Metropolitana Sur","Nombre":"Fiscalia Regional y Fiscalias Locales (Edificio Pirámide)","Direccion":"Piramide 1078","Ciudad":"San MIguel","Observacion":"Edificio Piramide","Latitud":"-33.500977","Longitud":"-70.6559623"},{"Inmueble":"Fiscalia Regional Metropolitana Sur","Nombre":"Fiscalia Local de Puente Alto","Direccion":"Jose Manuel Irarrazabla 283","Ciudad":"Puente Alto","Observacion":null,"Latitud":"-33.6076587","Longitud":"-70.5745448"},{"Inmueble":"Fiscalia Regional Metropolitanta Occidente","Nombre":"Fiscalias Locales de Pudahuel y Maipu","Direccion":"Bandera 655","Ciudad":"Santiago","Observacion":null,"Latitud":"-33.4357097","Longitud":"-70.6547868"},{"Inmueble":"Fiscalia Regional Metropolitanta Occidente","Nombre":"Fiscalia Local de San Bernardo","Direccion":"San Jose 840","Ciudad":"San Bernardo","Observacion":null,"Latitud":"-33.595604","Longitud":"-70.7120688"},{"Inmueble":"Fiscalia Regional Metropolitanta Occidente","Nombre":"Fiscalia Local de Talagante","Direccion":"Bernardo O'Higgins 2160","Ciudad":"Talagante","Observacion":null,"Latitud":"-33.6696344","Longitud":"-70.9414006"},{"Inmueble":"Fiscalia Regional Metropolitanta Occidente","Nombre":"Fiscalia Local de Melipilla","Direccion":"Serrano 891","Ciudad":"Melipilla","Observacion":null,"Latitud":"-33.6912934","Longitud":"-71.2163442"},{"Inmueble":"Fiscalia Regional Metropolitanta Occidente","Nombre":"Fiscalia Local de Curacavi","Direccion":"Presbitero Moraga Sur 100","Ciudad":"Curacavi","Observacion":null,"Latitud":"-33.4035899","Longitud":"-71.1307991"}]

  fiscalias.forEach(instalacion=>{
let template=JSON.parse(JSON.stringify(result[0]))
template["nombre"]=instalacion['Nombre']
template["longitude"]=parseFloat(instalacion['Longitud'])
template["latitude"]=parseFloat(instalacion['Latitud'])
template["cenco1_desc"]="FISCALIA STGO. TEST"
template["administrativo_id"]=instalacion['00000']
template["administrativo_nombre"]=instalacion['FISCALIAS NO ASIGNADAS']
template["cotiza_dot_asignada"]=0
template["cotiza_dot_vendida"]=0
template["cotiza_dot_vigente_erp"]=0
template["cenco2_codi"]='000-000'
result.push(template)

  })
      
          resolve(result);

        });

    });

}


function getResumenSupervisor(){
    let query=`  select estr.ADMINISTRATIVO_ID,estr.ADMINISTRATIVO_NOMBRE,convert(decimal(6,2),sum(DOT_VENDIDA_COTIZA)) as DOT_VENDIDA,convert(decimal(6,2),sum(DOT_ASIG_COTIZA)) as DOT_ASIGNADA,sum(PERSONAL_VIGENTE_ERP) as DOT_REAL from
    [SISTEMA_CENTRAL].[dbo].[bi_dotaciones]  as dot
     left join Inteligencias.dbo.VIEW_SIST_CENTRAL_ESTR_ORGANIZACION as estr
     on estr.cencos_codigo=dot.CENCO2_CODI and dot.EMP_CODI=estr.empresa_id
     where EMP_CODI=0
     and 
 
   ULT_ACTUALIZACION_DATOS=(select MAX(ULT_ACTUALIZACION_DATOS) from [SISTEMA_CENTRAL].[dbo].[bi_dotaciones] )
   and administrativo_nombre is not null
   group by estr.administrativo_id,estr.administrativo_nombre
    `;
    
    return new Promise(resolve=>{

        entrega_resultDB(query).then(result=>{
      
          resolve(result);

        });

    });

}

function createGeoJSON(data){



   
   
   //plantilla
    var geojsonFeature = [{
        "type": "Feature",
        "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!",
        "Group":"a"
        },
        "geometry": {
        "type": "Point",
        "coordinates": [-71.99404, 39.75621]
        }
        },
        {
        "type": "Feature",
        "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!",
        "Group":"a"
        },
        "geometry": {
        "type": "Point",
        "coordinates": [41.69861,-72.724141]
        }
        }];

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