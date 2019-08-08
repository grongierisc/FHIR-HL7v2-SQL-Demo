# FHIRAndHL7Demo
Ready to use demo of an FHIR Server and HL7v2 transformation to the FHIR Server on IRIS For Health Intersystems

## Prerequisites

Can be used on Intersystems IRIS For Health.

For docker, add your licence key in "misc/iris.key"

### Installing

Clone this repository

```
git clone https://github.com/grongierisc/FHIRAndHL7Demo.git
```

Docker

```
docker-compose up --build -d
```

### Usage

* Can use postman config in misc/fhirhl7v2demo.postman_collection.json

* Use UX at http://localhost:52776/csp/healthshare/FHIRHL7V2DEMO/HS.Test.UI.FHIR.Main.cls

* For HL7v2 demo use sampleFiles and put example to 'in' folder

* For $binary operator use : http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Binary/2/$binary
