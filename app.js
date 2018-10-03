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

app.get("/",function(req,res){
 
    var variable="variableeeee";
    var options=["a","b","c","d"];
    var plantas=getPlantas().then(result=>{
    //console.log(result);
  var geoJSON= JSON.stringify(createGeoJSON(result));
 
  var  cenco1=  result.map(value=>{
    return value.cenco1_desc;
  });
  var distinctCenco1=getUnique(cenco1);
  console.log(distinctCenco1);

   //var geoJSON=createGeoJSON(result);


    res.render("index",{variable:variable,opciones:options,geoJSON:geoJSON,distinctCenco1:distinctCenco1});

    });
   



});


 function getUnique(data){
    let unique = (value, index, self) => {
        return self.indexOf(value) == index;
    }
    return data.filter(unique); 

 }

function getPlantas(){
    let query=`SELECT [nombre],[longitude],[latitude] ,ci.CENCO1_DESC as cenco1_desc
    FROM [SISTEMA_CENTRAL].[dbo].[plantas] as p left join [SISTEMA_CENTRAL].[dbo].[centros_costos] as cc
    on p.centro_costos_id=cc.id
    left join Inteligencias.dbo.CENTROS_COSTO as ci
    
    on ci.CENCO2_CODI=cc.cencos_codigo collate SQL_Latin1_General_CP1_CI_AI  and ci.EMP_CODI=cc.empresa_id
    where cc.deleted_at is null`;
    
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
        "coordinates": [element.longitude,element.latitude]
        }
        ,"properties": {"Group":"a","name": "Coors Field","cenco1_desc":element.cenco1_desc}
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