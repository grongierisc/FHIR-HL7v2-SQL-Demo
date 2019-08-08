Class FHIRDemo.vSTU3.Repository.OperationProcessor Extends HS.FHIR.vSTU3.Repository.OperationProcessor
{

ClassMethod Binary(pRequest As HS.Message.FHIR.Request, ByRef pResponse As HS.Message.FHIR.Response) As %Status
{
    Set tSC = $$$OK
    Set tContentType = "json"
    Set tErrorText = ""


    If pRequest.Type="" {
        Set tErrorText = "$binary request must have resource type specified"
    } ElseIf pRequest.Type'="Binary" {
        Set tErrorText = "$binary request not supported for resource type "_pRequest.Type
    } ElseIf pRequest.Id="" {
        Set tErrorText = "$binary request must specify resource id in request URL"
    }
    If tErrorText'="" {
        Quit ##class(HS.FHIR.Utils).BadRequest(pRequest, .pResponse, "invalid", tErrorText)
         
    }

    Set tSC = ##class(HS.FHIR.vSTU3.Repository.Storage).Read(tContentType, "HS.FHIR.vSTU3.Model.Resource", pRequest.Type, pRequest.Id, pRequest.VId, "", "", .tResponseStream, .tResourceObject, .tErrors, .tStorageId)
    If $$$ISERR(tSC) Quit tSC
    
    Set tResponseStream = pResponse.GetPayloadOref()
    if tResponseStream.%IsA("HS.SDA3.QuickStream") {
				do tResponseStream.Clear(0)
			} else {
				do tResponseStream.Clear()
			}
    
    Set tSC = ##class(HS.Util.StreamUtils).Base64Decode(tResourceObject.%Get("content",,"stream"),.pOutput)
    If $$$ISERR(tSC) Quit tSC
    Set tSC =  tResponseStream.CopyFrom(pOutput)
    If $$$ISERR(tSC) Quit tSC
    
    Set pResponse.ContentType = tResourceObject.%Get("contentType",,"string")

    Set pResponse.Status = 200
    

    Quit tSC
}

}
