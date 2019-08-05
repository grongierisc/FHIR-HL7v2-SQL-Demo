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
password=$2

ClassImportDir=$DIR/src
NameSpace="FHIRHL7V2DEMO"

irissession $instanceName -U USER <<EOF 
SuperUser
SYS
password
password
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
zw errors
set status = ##class(HS.FHIR.DTL.Util.API.ExecDefinition).SetCustomDTLPackage("HS.Local.FHIR.DTL")
zw status
halt

EOF

exit
