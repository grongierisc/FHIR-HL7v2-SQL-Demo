Class FHIRDemo.REST.Dispatch Extends %CSP.REST
{

Parameter BsName = "WS_REST";

Parameter CHARSET = "utf-8";

Parameter HandleCorsRequest = 1;

XData UrlMap [ XMLNamespace = "http://www.fhirhl7v2demo.com/urlmap" ]
{
<Routes>
  <Route Url="/sendfile" Method="POST" Call="SendFileContent" Cors="true"/>
</Routes>
}

ClassMethod SendFileContent() As %Status
{
    If '..GetJSONFromRequest(.obj) {
        Set %response.Status = ..#HTTP400BADREQUEST
        Set error = {"errormessage": "JSON not found"}
        Write error.%ToJSON()
        Quit $$$OK
    }
    /// TODO  ajouter une modification
    Set content = obj.content
    set status = $$$OK
    set tMsg = ##class(EnsLib.HL7.Message).ImportFromString(content)
    try {
        $$$ThrowOnError(##class(Ens.Director).CreateBusinessService(..#BsName,.tService))
        
        $$$ThrowOnError(tService.ProcessInput(tMsg,.output))
    } catch(ex) {
        set status = ex.AsStatus()
    }
    
    Set result={}
    do result.%Set("Status",$s($$$ISERR(status):$system.Status.GetOneErrorText(status),1:"OK"))
    write result.%ToJSON()
    return $$$OK
}

ClassMethod GetJSONFromRequest(ByRef obj As %DynamicObject) As %Boolean
{
  Set ok = 1
	Try {
		Set obj = ##class(%DynamicObject).%FromJSON(%request.Content)
	} Catch ex {
		Set ok = 0
	}
	Quit ok
}

}
