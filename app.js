'use strict'

var express=require("express");

var app=express();
var path=require('path');
var sql = require("mssql");
var stringify = require('json-stringify');

// config for your database
var config = {
    user: 'targit',
    password: 'targit2020*',
    server: '192.168.100.112', 
    database: 'Inteligencias' 
};

app.set("view engine","jade");
app.use(express.static('public'));

app.get("/",function(req,res){
 
    var variable="variableeeee";
    var options=["a","b","c","d"];

    


    var plantas=getPlantas().then(result=>{
   // console.log(result);
  var dataResult=JSON.stringify(result);
  console.log(dataResult)
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

   
     resultSupervisor.filter(x=>x.administrativo_id).map(supervisor=>{
     supervisor.COLOR=supervisoresColor.find(x=>x.administrativo_id==supervisor.ADMINISTRATIVO_ID).color
     //supervisor.DOT_VENDIDA= supervisor.DOT_VENDIDA.toFixed(2)
        return  supervisor

     })
     console.log('resSUp',resultSupervisor)

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
   
   /*
    let query=`SELECT 
    accountNumber as Cuenta,replace(name,'"','') as cenco1_desc,replace(name,'"','') as nombre,
   convert(float, JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lat')) AS latitude
    ,convert(float,JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lng')) as longitude
    ,1 as administrativo_id,'' as administrativo_nombre
      FROM [MI-K1].[SISTEMA_CENTRAL].[dbo].[bi_salesforce_cuentas]
    
      where gmap is not null 
      and JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lat') is not null
      and JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lng') is not null
     --and  convert(float,JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lng')) >33
     and accountNumber<>'6171'
      
    `;

    */

   let query=`

SELECT cue_ncuenta as Cuenta, rtrim(ltrim(cue_ncuenta))+' - '+replace(cue_cnombre,'"','') as cenco1_desc,+replace(cue_cnombre,'"','') as nombre, cue_sf.latitude,cue_sf.longitude
    ,1 as administrativo_id,'' as administrativo_nombre
  FROM [Inteligencias].[dbo].[SG_CUENTAS]  as cue_sg 
  left join
  (
  SELECT 
       convert(int,accountNumber) as cuenta_int,replace(name,'"','')  as cenco1_desc,Name as nombre,
      convert(float, JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lat')) AS latitude
       ,convert(float,JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lng')) as longitude
       ,1 as administrativo_id,'' as administrativo_nombre
         FROM [MI-K1].[SISTEMA_CENTRAL].[dbo].[bi_salesforce_cuentas]
       
         where 
		  ISNUMERIC(accountNumber)=1 and
		 gmap is not null 
		-- and JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lat') is not null
		-- and JSON_VALUE(convert(nvarchar(max),gmap), '$.geometry.location.lng') is not null
		)cue_sf

		on cue_sf.cuenta_int= convert(int,cue_ncuenta)

		where 
		 cue_Estado_Desc='ACTIVA'  and ISNUMERIC(cue_ncuenta)=1 and convert(int,cue_sg.cue_ncuenta)>1
		 and latitude is not null and longitude is not null
     
   `;
    
    return new Promise(resolve=>{

        entrega_resultDB(query).then(result=>{

          resolve(result);

        });

    });

}


function getResumenSupervisor(){
    let query=`  select estr.ADMINISTRATIVO_ID,estr.ADMINISTRATIVO_NOMBRE,convert(decimal(6,2),sum(DOT_VENDIDA_COTIZA)) as DOT_VENDIDA,convert(decimal(6,2),sum(DOT_ASIG_COTIZA)) as DOT_ASIGNADA,sum(PERSONAL_VIGENTE_ERP) as DOT_REAL from
    [MI-K1].[SISTEMA_CENTRAL].[dbo].[bi_dotaciones]  as dot
     left join Inteligencias.dbo.VIEW_SIST_CENTRAL_ESTR_ORGANIZACION as estr
     on estr.cencos_codigo=dot.CENCO2_CODI and dot.EMP_CODI=estr.empresa_id
     where EMP_CODI=0
     and 
 
   ULT_ACTUALIZACION_DATOS=(select MAX(ULT_ACTUALIZACION_DATOS) from [MI-K1].[SISTEMA_CENTRAL].[dbo].[bi_dotaciones] )
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