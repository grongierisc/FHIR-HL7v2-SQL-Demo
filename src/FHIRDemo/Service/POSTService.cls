Class FHIRDemo.Service.POSTService Extends EnsLib.HL7.Service.Standard
{

Parameter CONTENTTYPE = "text/xml";

Parameter ADAPTER = "EnsLib.HTTP.InboundAdapter";

Property TargetConfigNames As %String(MAXLEN = 1000) [ InitialExpression = "HL7toSDAProcess" ];

Parameter SETTINGS = "TargetConfigNames:Basic:selector?multiSelect=1&context={Ens.ContextSearch/ProductionItems?targets=1&productionName=@productionId}";

Method OnProcessInput(pDocIn As %RegisteredObject, Output pDocOut As %RegisteredObject) As %Status
{
    set status = $$$OK
    set request = pDocIn

    set request.DocType=..resolveDocType(pDocIn)
    
    try {
        //$$$ThrowOnError(..SendRequestSync(..#TARGET, request, .pDocOut))
        for iTarget=1:1:$L(..TargetConfigNames, ",") {
		    set tOneTarget=$ZStrip($P(..TargetConfigNames,",",iTarget),"<>W")  Continue:""=tOneTarget
		    set tSC1=..SendRequestSync(tOneTarget,request,.pDocOut)  Set:$$$ISERR(tSC1) tSC=$$$ADDSC(tSC,tSC1)
	    }
    } catch ex {
        set status = ex.AsStatus()
    }
    Quit status
}

/// Return an array of connections for drawing lines on the config diagram
ClassMethod OnGetConnections(Output pArray As %String, pItem As Ens.Config.Item)
{
	Do ##super(.pArray,pItem)
	If pItem.GetModifiedSetting("TargetConfigNames",.tValue) {
		For i=1:1:$L(tValue,",") { Set tOne=$ZStrip($P(tValue,",",i),"<>W")  Continue:""=tOne  Set pArray(tOne)="" }
	}
}

}
