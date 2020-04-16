#!/bin/bash
# Usage install.sh [instanceName]

DIR=$(dirname $0)
if [ "$DIR" = "." ]; then
DIR=$(pwd)
fi

instanceName=$1
password=password

ClassImportDir=$DIR/src
NameSpace=""FHIRHL7V2DEMO""

irissession $instanceName -U USER <<EOF 
sys
sys
zn "HSLIB"
Set appKey = "/fhirhl7v2demo/fhir/r4"
Set strategyClass = "HS.FHIRServer.Storage.Json.InteractionsStrategy"
Set metadataConfigKey = "HL7v40"

//Install a Foundation namespace and change to it
Do ##class(HS.HC.Util.Installer).InstallFoundation("$NameSpace")
zn "$NameSpace"

// Install elements that are required for a FHIR-enabled namespace
Do ##class(HS.FHIRServer.Installer).InstallNamespace()

// Install an instance of a FHIR Service into the current namespace
Do ##class(HS.FHIRServer.Installer).InstallInstance(appKey, strategyClass, metadataConfigKey)
do ##class(Ens.Director).StopProduction()
do \$system.OBJ.ImportDir("$ClassImportDir","*.cls","cdk",.errors,1)

zw \$classmethod("Ens.Director", "SetAutoStart", "FHIRHL7V2DEMOPKG.FoundationProduction", 0)

set cspConfig = ##class(HS.Util.RESTCSPConfig).URLIndexOpen(appKey)
set cspConfig.ServiceConfigName = "HS.FHIRServer.Interop.Service"
do cspConfig.%Save()


zn "%SYS"
set props2("NameSpace") = "$NameSpace"
set props2("DispatchClass") = "FHIRDemo.REST.Dispatch"
set props2("CookiePath") = "/csp/demo/rest/"
set props2("Description") = "Demo REST API"
set props2("MatchRoles") = ":%All"
set tSC = ##class(Security.Applications).Create("/csp/demo/rest", .props2)
zw tSCs

w "change application setting"
set oCSPApp = ##class(Security.Applications).%OpenId("/csp/demo/rest", , .tSC)
set oCSPApp.AutheEnabled = 64
do oCSPApp.%Save()

set oCSPApp = ##class(Security.Applications).%OpenId(appKey, , .tSC)
set oCSPApp.AutheEnabled = 64
do oCSPApp.%Save()
halt
EOF
