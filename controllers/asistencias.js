
'use strict'


const sql_connector = require('../controllers/sql');


function getPersonalVigente(){

    let query=`  
    select 
    per.PLANILLA as DetalleFuncIdPlanilla,ltrim(rtrim(per.FICHA)) as DetalleFuncFicha,per.Colacion as DetalleFuncColacion,ltrim(rtrim(per.Horas)) as DetalleFuncHorasTipo,per.Id_Detalle,ltrim(rtrim(p.Rut)) as PersonalRut,p.Nombre as PersonalNombre,per.DF_Contrato as DetalleFuncContrato,per.DF_Finiquito as DetalleFuncFiniquito,per.IdPersona,per.DF_Activo as DetalleFuncActivo,per.FechaCreacionIngreso as DetalleFuncFechaIngreso
    ,cc.Empresa as CentroCostoEmpresa ,ltrim(rtrim(cc.Codigo)) as CentroCostoCodigo,cc.Descripcion as CentroCostoDesc
    from
    turnos2.dbo.Detalle_Funcionarios per 
     left join turnos2.dbo.Personas p on p.IdPersona=per.IdPersona
     left join turnos2.dbo.Planilla pl on pl.ID_PL=per.PLANILLA
     left join [Turnos2].[dbo].[CentroCosto]  cc
      on cc.Id_Centro=pl.AREA_CCTO and cc.Empresa=pl.Empresa 
     where --detallefuncidplanilla<0 para partimes
      (pl.VIGENTE=1 or per.PLANILLA<0) and per.DF_Activo=1 and per.idPersona>0`
    
    ;
    
    return new Promise(resolve=>{
  
        sql_connector.entrega_resultDB(query).then(result=>{
      
          resolve(result);
  
        });
  
    });
  
  }


  module.exports={getPersonalVigente}