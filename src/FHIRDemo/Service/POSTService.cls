Class FHIRDemo.Service.POSTService Extends EnsLib.HL7.Service.Standard
{

Parameter CONTENTTYPE = "text/xml";

Parameter ADAPTER = "EnsLib.HTTP.InboundAdapter";

Parameter TARGET = "HL7toSDAProcess";

Method OnProcessInput(pDocIn As %RegisteredObject, Output pDocOut As %RegisteredObject) As %Status
{
    set status = $$$OK
    set request = pDocIn
    try {
        $$$ThrowOnError(..SendRequestSync(..#TARGET, request, .pDocOut))
    } catch ex {
        set status = ex.AsStatus()
    }
    Quit status
}

}
