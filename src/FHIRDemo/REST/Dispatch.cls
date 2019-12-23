Class FHIRDemo.REST.Dispatch Extends %CSP.REST
{

Parameter CHARSET = "utf-8";

Parameter HandleCorsRequest = 1;

XData UrlMap [ XMLNamespace = "http://www.fhirhl7v2demo.com/urlmap" ]
{
<Routes>
  <Route Url="/massie" Method="GET" Call="SendMassie" Cors="true"/>
  <Route Url="/carter" Method="GET" Call="SendCarter" Cors="true"/>
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
  
  Set content = obj.content
  Set fileName = obj.fileName
  Set fullFileName = "/home/irisowner/src/sampleFiles/"_fileName_".txt"
  Set destination = "/home/irisowner/in"

  Set file=##class(%File).%New(fullFileName)
	Set sc = file.Open("WSN")
  Set sc = file.Write(content)

  if ##class(%File).Exists(fullFileName) 
  {
    if ##class(%File).DirectoryExists(destination) 
    {
      set sc = ##class(%File).CopyFile(fullFileName, destination) 
    }
  }
  
  Set result={}
  do result.%Set("Status",$s($$$ISERR(sc):$system.Status.GetOneErrorText(sc),1:"OK"))
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

ClassMethod SendMassie() As %Status
{
  set status = $$$OK
  set filename = "/home/irisowner/src/sampleFiles/ADT_A01Massie.txt"
  set destination = "/home/irisowner/in"
  if ##class(%File).Exists(filename) {
    if ##class(%File).DirectoryExists(destination) {
      set res = ##class(%File).CopyFile(filename, destination) 
    }
  }

  return status
}

ClassMethod SendCarter() As %Status
{
  set status = $$$OK
  set filename = "/home/irisowner/src/sampleFiles/ADT_A01Carter.txt"
  set destination = "/home/irisowner/in"
  if ##class(%File).Exists(filename) {
    if ##class(%File).DirectoryExists(destination) {
      set res = ##class(%File).CopyFile(filename, destination) 
    }
  }
  return status
}

}
