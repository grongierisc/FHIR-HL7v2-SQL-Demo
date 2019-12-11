#!/bin/bash
# Usage install.sh [instanceName]

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 1 ] || die "Usage install.sh [instanceName]"

DIR=$(dirname $0)
if [ "$DIR" = "." ]; then
DIR=$(pwd)
fi

instanceName=$1
password=password

ClassImportDir=$DIR/src
NameSpace="FHIRHL7V2DEMO"

irissession $instanceName -U USER <<EOF 
SuperUser
$password
zn "HSLIB"
do ##class(HS.HC.Util.Installer.FHIR).Install()
$NameSpace
N
Y


Y
N
N
N
Y
zn "$NameSpace"
do ##class(Ens.Director).StopProduction()
do \$system.OBJ.ImportDir("$ClassImportDir","*.cls","cdk",.errors,1)
zw ##class(HS.FHIR.DTL.Util.API.ExecDefinition).SetCustomDTLPackage("HS.Local.FHIR.DTL")

zw \$SYSTEM.SQL.Execute("update HS_Registry_Service.HTTP set host = 'fhirhl7v2demo'")
zw ##class(Ens.Config.Credentials).SetCredential("HS_Services","HS_Services","$password",1)
zw \$classmethod("Ens.Director", "SetAutoStart", "FHIRHL7V2DEMOPKG.FoundationProduction", 0)

zn "%SYS"
Set oCSPApp = ##class(Security.Applications).%OpenId("/csp/healthshare/fhirhl7v2demo/fhir/stu3", , .tSC)
Set oCSPApp.DispatchClass="FHIRDemo.vSTU3.REST.Handler"
Set oCSPApp.AutheEnabled = 64
Set tSC = oCSPApp.%Save()

zn "%SYS"
set props2("NameSpace") = "$NameSpace"
set props2("DispatchClass") = "FHIRDemo.REST.Dispatch"
set props2("CookiePath") = "/csp/demo/rest/"
set props2("Description") = "Demo REST API"
set tSC = ##class(Security.Applications).Create("/csp/demo/rest", .props2)
zw tSCs

w "change application setting"
set oCSPApp = ##class(Security.Applications).%OpenId("/csp/demo/rest", , .tSC)
set oCSPApp.AutheEnabled = 32
do oCSPApp.%Save()
halt
EOF