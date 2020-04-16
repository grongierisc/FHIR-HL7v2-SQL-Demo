Class FHIRHL7V2DEMOPKG.FoundationProduction Extends Ens.Production [ Not ProcedureBlock ]
{

XData ProductionDefinition
{
<Production Name="FHIRHL7V2DEMOPKG.FoundationProduction" TestingEnabled="true" LogGeneralTraceEvents="false">
  <Description></Description>
  <ActorPoolSize>1</ActorPoolSize>
  <Item Name="Ens.Activity.Operation.Local" Category="Demo" ClassName="Ens.Activity.Operation.Local" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
  </Item>
  <Item Name="From_ADT" Category="Demo" ClassName="EnsLib.HL7.Service.FileService" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Host" Name="MessageSchemaCategory">2.3.1</Setting>
    <Setting Target="Host" Name="TargetConfigNames">HL7toSDAProcess</Setting>
    <Setting Target="Adapter" Name="FilePath">/home/irisowner/in/</Setting>
    <Setting Target="Adapter" Name="ArchivePath">/home/irisowner/out/</Setting>
    <Setting Target="Adapter" Name="FileSpec">*.txt</Setting>
    <Setting Target="Adapter" Name="WorkPath">/usr/irissys/mgr/Temp/</Setting>
  </Item>
  <Item Name="WS_REST" Category="Demo" ClassName="FHIRDemo.Service.POSTService" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
    <Setting Target="Host" Name="MessageSchemaCategory">2.3.1</Setting>
  </Item>
  <Item Name="HS.FHIR.DTL.Util.HC.SDA3.FHIR.Process" Category="Demo" ClassName="HS.FHIR.DTL.Util.HC.SDA3.FHIR.Process" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="true" Schedule="">
    <Setting Target="Host" Name="TargetConfigName">HS.FHIRServer.Interop.Operation</Setting>
    <Setting Target="Host" Name="FHIREndpoint">/fhirhl7v2demo/fhir/r4</Setting>
    <Setting Target="Host" Name="FHIRMetadataSet">HL7v40 / Base HL7 Metadata for FHIR R4 (4.0.1)</Setting>
    <Setting Target="Host" Name="FormatFHIROutput">1</Setting>
    <Setting Target="Host" Name="OutputToQuickStream">1</Setting>
  </Item>
  <Item Name="HL7toSDAProcess" Category="Demo" ClassName="FHIRDemo.HL7TransformProcess" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
  </Item>
  <Item Name="HS.FHIRServer.Interop.Service" Category="" ClassName="HS.FHIRServer.Interop.Service" PoolSize="0" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
  </Item>
  <Item Name="HS.FHIRServer.Interop.Operation" Category="" ClassName="HS.FHIRServer.Interop.Operation" PoolSize="1" Enabled="true" Foreground="false" Comment="" LogTraceEvents="false" Schedule="">
  </Item>
</Production>
}

}
