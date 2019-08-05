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
set status = ##class(HS.FHIR.DTL.Util.API.ExecDefinition).SetCustomDTLPackage("HS.Local.FHIR.DTL")
zw \$system.OBJ.Compile("FHIRHL7V2DEMOPKG.FoundationProduction")
zw \$SYSTEM.SQL.Execute("update HS_Registry_Service.HTTP set host = 'fhirhl7v2demo'")
zw ##class(Ens.Config.Credentials).SetCredential("HS_Services","HS_Services","$password",1)
zw \$classmethod("Ens.Director", "SetAutoStart", "FHIRHL7V2DEMOPKG.FoundationProduction", 0)
halt
EOF