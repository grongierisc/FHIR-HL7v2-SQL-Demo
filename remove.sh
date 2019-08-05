#!/bin/bash
# Usage remove.sh [instanceName] [password]

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 2 ] || die "Usage remove.sh [instanceName] [password]"

DIR=$(dirname $0)
if [ "$DIR" = "." ]; then
DIR=$(pwd)
fi

instanceName=$1
password=$2
namespace="FHIRHL7V2DEMO"

irissession $instanceName -U %SYS <<EOF 
SuperUser
$password

Set NsEiste = ##class(Config.Namespaces).Exists("$namespace")
do:(NsEiste) ##class(Config.Namespaces).Delete("$namespace")
do:(NsEiste) ##class(%Library.EnsembleMgr).DisableNamespace("$namespace")

set CspExiste = ##Class(Security.Applications).Exists("$csppath")
do:(CspExiste) ##Class(Security.Applications).Delete("$csppath")

set CspExiste = ##Class(Security.Applications).Exists("$csppathfrom")
do:(CspExiste) ##Class(Security.Applications).Delete("$csppathfrom")

set CspExiste = ##Class(Security.Applications).Exists("$cspworklist")
do:(CspExiste) ##Class(Security.Applications).Delete("$cspworklist")

set DbExiste = ##class(Config.Databases).Exists("$namespace")
set Directory = ##class(Config.Databases).GetDirectory("$namespace")
do:(DbExiste) ##class(Config.Databases).Delete("$namespace")
do ##class(SYS.Database).DeleteDatabase(Directory)

halt
EOF

