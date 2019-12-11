import { Component, OnInit } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  encapsulation: ViewEncapsulation.None
})



export class UploadComponent implements OnInit {

  DataForm : FormGroup;
  createPatientIsShow = true;
  postBinaryIsShow = true;
  createAllergyPatient1IsShow = true;
  getBundlePatientIsShow = true;
  updatePatientIsShow = true;
  getBinaryIsShow = true;
  getBinaryFileIsShow = true;
  getAllPatientIsShow = true;
  getFullPatientViewIsShow = true;

  constructor(private http: HttpClient) {
    this.DataForm = new FormGroup({
      createPatientUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Patient"),
      postBinaryUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Binary"),
      createAllergyPatient1Url : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/AllergyIntolerance"),
      getBundlePatientUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/"),
      updatePatientUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Patient/1"),
      getBinaryUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Binary/1"),
      getBinaryFileUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Binary/1/$binary"),
      getAllPatientUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Patient"),
      getFullPatientViewUrl : new FormControl("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Patient/1/$everything")
    });
  }

  ngOnInit() {
  }

  call_api(name, method) {
    var url = this.DataForm.get(name+"Url").value
    if (method == "post") {
      this.http_post(name, url)
    } else if (method == "get") {
      this.http_get(name, url)
    } else if (method == "put") {
      this.http_put(name, url)
    }
  }

  http_get(name, url) {
    var response = document.getElementById(name+"Response");
    this.http.get(url).subscribe((data: any) => {
      console.log(data)
      var res = JSON.stringify(data, undefined, 4)
      response.innerHTML = res
    }, error => {
      console.log("There was an error during GET", error);
      var res = JSON.stringify(error, undefined, 4)
      response.innerHTML = res
    });
    this[name+"IsShow"] = false
  }
  

  http_put(name, url) {
    // var response = document.getElementById(name+"Response");
    // this.http.put(url).subscribe((data: any) => {
    //   console.log(data)
    //   var res = JSON.stringify(data, undefined, 4)
    //   response.innerHTML = res
    // }, error => {
    //   console.log("There was an error during PUT", error);
    //   var res = JSON.stringify(error, undefined, 4)
    //   response.innerHTML = res
    // });
    // this[name+"IsShow"] = false
  }

  http_post(name, url) {
    // var response = document.getElementById(name+"Response");
    // this.http.post(url).subscribe((data: any) => {
    //   console.log(data)
    //   var res = JSON.stringify(data, undefined, 4)
    //   response.innerHTML = res
    // }, error => {
    //   console.log("There was an error during POST", error);
    //   var res = JSON.stringify(error, undefined, 4)
    //   response.innerHTML = res
    // });
    // this[name+"IsShow"] = false
  }

}
