# FHIRAndHL7Demo

Ready to use demo of an FHIR Server with :
* HL7v2 transformation to the FHIR Server 
* FHIR Server who can be query in SQL

![alt text](https://raw.githubusercontent.com/grongierisc/FHIRAndHL7Demo/master/fhirhl7ui/app/src/assets/img/FHIRdemo.jpg)

## Prerequisites

Can be used on Intersystems IRIS For Health.

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

* Use UX at http://localhost:52776/csp/healthshare/FHIRHL7V2DEMO/fhirconfig/index.html#/server-config

* For HL7v2 demo use sampleFiles and put example to 'in' folder

