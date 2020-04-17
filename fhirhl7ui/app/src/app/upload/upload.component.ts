import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class UploadComponent implements OnInit {

  DataForm : FormGroup;
  createPatientHidden = true;
  createAllergyPatientHidden = true;
  getBundlePatientHidden = true;
  updatePatientHidden = true;
  getBinaryHidden = true;
  getBinaryFileHidden = true;
  getAllPatientHidden = true;
  getFullPatientViewHidden = true;

  RequestDataForm : FormGroup;
  createPatientRequestHidden = true;
  createAllergyPatientRequestHidden = true;
  updatePatientRequestHidden = true; 

  constructor(private http: HttpClient) {
    this.DataForm = new FormGroup({
    createPatientUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Patient"),
    createAllergyPatientUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/AllergyIntolerance"),
    getBundlePatientUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/"),
    updatePatientUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Patient/1"),
    getBinaryUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Binary/1"),
    getBinaryFileUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Binary/1/$binary"),
    getAllPatientUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Patient"),
    getFullPatientViewUrl : new FormControl("http://localhost:52776/fhirhl7v2demo/fhir/r4/Patient/1/$everything")
    });
    this.RequestDataForm = new FormGroup({
    createPatientRequest : new FormControl(this.createPatientBody),
    createAllergyPatientRequest : new FormControl(this.createAllergyPatientBody),
    updatePatientRequest : new FormControl(this.updatePatientBody),
    });
  }

  ngOnInit() {
  }

  showRequest(name:string) {
    this[name+"RequestHidden"] = !this[name+"RequestHidden"]
  }

  call_api(name:string, method:string) {
    var url = this.DataForm.get(name+"Url").value
    if (method == "post") {
      this.http_post(name, url)
    } else if (method == "get") {
      this.http_get(name, url)
    } else if (method == "put") {
      this.http_put(name, url)
    }
  }

  http_get(name:string, url:any) {
    var response = document.getElementById(name+"Response");
    this.http.get(url).subscribe((data: any) => {
      var res = JSON.stringify(data, undefined, 4)
      response.innerHTML = res
    }, error => {
      console.log("There was an error during GET", error);
      var res = JSON.stringify(error, undefined, 4)
      response.innerHTML = res
    });
    this[name+"Hidden"] = false
  }

  getJSON(url:any): Observable<any> {
    return this.http.get(url);
  }

  http_post(name:string, url:any) {
    var response = document.getElementById(name+"Response");
    var body = this.RequestDataForm.get(name+"Request").value
    var httpOptions : any;

    httpOptions = this.httpOptionsPatient;
    
    this.http.post(url, body, httpOptions).subscribe((data: any) => {
      var res = JSON.stringify(data, undefined, 4)
      if (data == null || data == undefined) {
        res = "Success"
      }
      response.innerHTML = res
    }, error => {
      console.log("There was an error during POST", error);
      var res = JSON.stringify(error, undefined, 4)
      response.innerHTML = res
    });
    this[name+"Hidden"] = false
  }

  http_put(name:string, url:any) {
    var response = document.getElementById(name+"Response");
    var body = this.RequestDataForm.get(name+"Request").value
    var httpOptions = this.httpOptionsPatient;
    this.http.put(url, body, httpOptions).subscribe((data: any) => {
      var res = JSON.stringify(data, undefined, 4)
      if (data == null || data == undefined) {
        res = "Success"
      }
      response.innerHTML = res
    }, error => {
      console.log("There was an error during PUT", error);
      var res = JSON.stringify(error, undefined, 4)
      response.innerHTML = res
    });
    this[name+"Hidden"] = false
  }

  httpOptionsPatient = {
    headers: new HttpHeaders(
      {
        "Content-Type": "application/fhir+json; charset=UTF-8",
        "Type": "Patient"
      }
    )
  };
  
  createPatientBody = "{\n    \"resourceType\": \"Patient\",\n    \"identifier\": [\n        {\n            \"type\": {\n                \"coding\": [\n                    {\n                        \"code\": \"MR\",\n                        \"display\": \"MR\"\n                    }\n                ],\n                \"text\": \"MR\"\n            },\n            \"system\": \"urn:oid:1.3.6.1.4.1.21367.2010.1.2.300.2.2\",\n            \"value\": \"200000002\"\n        }\n    ],\n    \"active\": true,\n    \"name\": [\n        {\n            \"use\": \"usual\",\n            \"family\": \"CRUZ GONZALEZ\",\n            \"given\": [\n                \"Salvador\",\n                \"Guillermo\"\n            ]\n        }\n    ],\n    \"gender\": \"male\",\n    \"birthDate\": \"1984-08-07\",\n    \"deceasedBoolean\": false,\n    \"address\": [\n        {\n            \"use\": \"home\"\n        }\n    ],\n    \"multipleBirthBoolean\": false,\n    \"communication\": [\n        {\n            \"language\": {\n                \"coding\": [\n                    {\n                        \"code\": \"en\",\n                        \"display\": \"English\"\n                    }\n                ],\n                \"text\": \"English\"\n            },\n            \"preferred\": true\n        }\n    ]\n}"

  getBundlePatientBody = "{\n  \"resourceType\": \"Bundle\",\n  \"id\": \"bundle-request-medsallergies\",\n  \"type\": \"batch\",\n  \"entry\": [\n    {\n      \"request\": {\n        \"method\": \"GET\",\n        \"url\": \"/Patient/1\"\n      }\n    },\n    {\n      \"request\": {\n        \"method\": \"GET\",\n        \"url\": \"/AllergyIntolerance?patient=1\"\n      }\n    }\n  ]\n}"

  createAllergyPatientBody ="{\n  \"resourceType\": \"AllergyIntolerance\",\n  \"text\": {\n    \"status\": \"generated\",\n    \"div\": \"<div xmlns=\\\"http://www.w3.org/1999/xhtml\\\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: example</p><p><b>identifier</b>: 49476534</p><p><b>clinicalStatus</b>: active</p><p><b>verificationStatus</b>: confirmed</p><p><b>type</b>: allergy</p><p><b>category</b>: food</p><p><b>criticality</b>: high</p><p><b>code</b>: Cashew nuts <span>(Details : {SNOMED CT code '227493005' = 'Cashew nuts', given as 'Cashew nuts'})</span></p><p><b>patient</b>: <a>Patient/example</a></p><p><b>onset</b>: 01/01/2004</p><p><b>assertedDate</b>: 09/10/2014 2:58:00 PM</p><p><b>recorder</b>: <a>Practitioner/example</a></p><p><b>asserter</b>: <a>Patient/example</a></p><p><b>lastOccurrence</b>: 01/06/2012</p><p><b>note</b>: The criticality is high becasue of the observed anaphylactic reaction when challenged with cashew extract.</p><blockquote><p><b>reaction</b></p><p><b>substance</b>: cashew nut allergenic extract Injectable Product <span>(Details : {RxNorm code '1160593' = '1160593', given as 'cashew nut allergenic extract Injectable Product'})</span></p><p><b>manifestation</b>: Anaphylactic reaction <span>(Details : {SNOMED CT code '39579001' = 'Anaphylaxis', given as 'Anaphylactic reaction'})</span></p><p><b>description</b>: Challenge Protocol. Severe reaction to subcutaneous cashew extract. Epinephrine administered</p><p><b>onset</b>: 12/06/2012</p><p><b>severity</b>: severe</p><p><b>exposureRoute</b>: Subcutaneous route <span>(Details : {SNOMED CT code '34206005' = 'Subcutaneous route', given as 'Subcutaneous route'})</span></p></blockquote><blockquote><p><b>reaction</b></p><p><b>manifestation</b>: Urticaria <span>(Details : {SNOMED CT code '64305001' = 'Urticaria', given as 'Urticaria'})</span></p><p><b>onset</b>: 01/01/2004</p><p><b>severity</b>: moderate</p><p><b>note</b>: The patient reports that the onset of urticaria was within 15 minutes of eating cashews.</p></blockquote></div>\"\n  },\n  \"identifier\": [\n    {\n      \"system\": \"http://acme.com/ids/patients/risks\",\n      \"value\": \"49476534\"\n    }\n  ],\n  \"clinicalStatus\": \"active\",\n  \"verificationStatus\": \"confirmed\",\n  \"type\": \"allergy\",\n  \"category\": [\n    \"food\"\n  ],\n  \"criticality\": \"high\",\n  \"code\": {\n    \"coding\": [\n      {\n        \"system\": \"http://snomed.info/sct\",\n        \"code\": \"227493005\",\n        \"display\": \"Cashew nuts\"\n      }\n    ]\n  },\n  \"patient\": {\n    \"reference\": \"Patient/1\"\n  },\n  \"onsetDateTime\": \"2004\",\n  \"assertedDate\": \"2014-10-09T14:58:00+11:00\",\n  \"recorder\": {\n    \"reference\": \"Practitioner/example\"\n  },\n  \"asserter\": {\n    \"reference\": \"1\"\n  },\n  \"lastOccurrence\": \"2012-06\",\n  \"note\": [\n    {\n      \"text\": \"The criticality is high becasue of the observed anaphylactic reaction when challenged with cashew extract.\"\n    }\n  ],\n  \"reaction\": [\n    {\n      \"substance\": {\n        \"coding\": [\n          {\n            \"system\": \"http://www.nlm.nih.gov/research/umls/rxnorm\",\n            \"code\": \"1160593\",\n            \"display\": \"cashew nut allergenic extract Injectable Product\"\n          }\n        ]\n      },\n      \"manifestation\": [\n        {\n          \"coding\": [\n            {\n              \"system\": \"http://snomed.info/sct\",\n              \"code\": \"39579001\",\n              \"display\": \"Anaphylactic reaction\"\n            }\n          ]\n        }\n      ],\n      \"description\": \"Challenge Protocol. Severe reaction to subcutaneous cashew extract. Epinephrine administered\",\n      \"onset\": \"2012-06-12\",\n      \"severity\": \"severe\",\n      \"exposureRoute\": {\n        \"coding\": [\n          {\n            \"system\": \"http://snomed.info/sct\",\n            \"code\": \"34206005\",\n            \"display\": \"Subcutaneous route\"\n          }\n        ]\n      }\n    },\n    {\n      \"manifestation\": [\n        {\n          \"coding\": [\n            {\n              \"system\": \"http://snomed.info/sct\",\n              \"code\": \"64305001\",\n              \"display\": \"Urticaria\"\n            }\n          ]\n        }\n      ],\n      \"onset\": \"2004\",\n      \"severity\": \"moderate\",\n      \"note\": [\n        {\n          \"text\": \"The patient reports that the onset of urticaria was within 15 minutes of eating cashews.\"\n        }\n      ]\n    }\n  ]\n}"

  updatePatientBody = "{\n    \"resourceType\": \"Patient\",\n    \"identifier\": [\n        {\n            \"type\": {\n                \"coding\": [\n                    {\n                        \"code\": \"MR\",\n                        \"display\": \"MR\"\n                    }\n                ],\n                \"text\": \"MR\"\n            },\n            \"system\": \"urn:oid:1.3.6.1.4.1.21367.2010.1.2.300.2.2\",\n            \"value\": \"200000002\"\n        }\n    ],\n    \"active\": true,\n    \"name\": [\n        {\n            \"use\": \"usual\",\n            \"family\": \"CRUZ GONZALEZ\",\n            \"given\": [\n                \"Salvador\",\n                \"Guillermo\"\n            ]\n        }\n    ],\n    \"gender\": \"male\",\n    \"birthDate\": \"1984-08-07\",\n    \"deceasedBoolean\": false,\n    \"address\": [\n        {\n            \"use\": \"home\"\n        }\n    ],\n    \"multipleBirthBoolean\": false,\n    \"communication\": [\n        {\n            \"language\": {\n                \"coding\": [\n                    {\n                        \"code\": \"en\",\n                        \"display\": \"English\"\n                    }\n                ],\n                \"text\": \"English\"\n            },\n            \"preferred\": true\n        }\n    ],\n    \"id\": \"1\",\n    \"meta\": {\n        \"versionId\": \"1\",\n        \"lastUpdated\": \"2019-08-06T08:11:10Z\"\n    }\n}"
  
}
