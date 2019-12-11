Class FHIRDemo.REST.Dispatch Extends %CSP.REST
{

Parameter CHARSET = "utf-8";

Parameter HandleCorsRequest = 1;

XData UrlMap [ XMLNamespace = "http://www.fhirhl7v2demo.com/urlmap" ]
{
<Routes>
  <Route Url="/massie" Method="GET" Call="SendMassie" Cors="true"/>
  <Route Url="/carter" Method="GET" Call="SendCarter" Cors="true"/>
  <Route Url="/" Method="GET" Call="Test" Cors="true"/>
</Routes>
}

ClassMethod Test() As %Status
{
  write "Ca marche bien",!
  return $$$OK
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
