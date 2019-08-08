Class FHIRDemo.vSTU3.REST.Handler Extends HS.FHIR.vSTU3.REST.Handler
{

ClassMethod marshallResponse(pResponse As HS.Message.FHIR.Response, pDefaultStatus As %String = {##class(HS.FHIR.Utils).#HTTP200OK}) As %Status [ Internal ]
{
	#dim tStatus As %Status = $$$OK
	Try {
		
		#dim %response As %CSP.Response
		#dim tKey As %String
		#dim tValue As %String
		#dim tHTTPCode As %String
		#dim tHTTPStatus As %String

		// Set up HTTP response code
		Set tHTTPCode = $SELECT(pResponse.Status'="":pResponse.Status,1:pDefaultStatus)

		// Make sure we're returning proper HTTP status codes & messages
		Set tStatus = ##class(HS.FHIR.Helper).LookupHTTPStatusText(tHTTPCode,.tHTTPStatus)
		Quit:$$$ISERR(tStatus)

		Set %response.Status = +tHTTPCode _" "_ tHTTPStatus
		
		// Inject any HTTP headers
		Set tKey = ""
		For {
			Set tValue = pResponse.Headers.GetNext(.tKey)
			Quit:tKey=""
			
			Do %response.SetHeader(tKey, tValue)
			
			// NOTE: This may include any Location or Content-Location headers as necessary
			//       for the interaction.  This is handled by the business service.
		}
				
		// Set the content type
		Set %response.ContentType = pResponse.ContentType
		//Set %response.CharSet = "UTF-8"
		
		// Inject the payload
		Set tResponseStream = pResponse.GetPayloadOref()
		If $IsObject(tResponseStream) {
			Do tResponseStream.Rewind()
			For {
				Set tStatus = tResponseStream.OutputToDevice($$$MaxLocalLength)
				If $$$ISERR(tStatus) Quit
				If tResponseStream.AtEnd Quit
			}
			// If a QuickStream, delete it, now that we are done with it.
			If tResponseStream.%IsA("HS.SDA3.QuickStream") Do tResponseStream.Clear()
		}
		
	} Catch (tUnexpected) {
		Set tStatus = tUnexpected.AsStatus()
	}
	
    Quit tStatus
}

}
