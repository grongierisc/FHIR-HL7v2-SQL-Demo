import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormControl } from '@angular/forms';
import bsCustomFileInput from 'bs-custom-file-input'


declare var imageMapResize: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    HL7fileForm : FormGroup;

    constructor(private http: HttpClient) {
        this.HL7fileForm = new FormGroup({
            HL7fileUpload : new FormControl(),
            HL7v2filePreview : new FormControl(""),
        })
     }

    ngOnInit() {
        var fhir_img = document.getElementById('fhir_img');

        fhir_img.style.width = "80%";
        imageMapResize()
        bsCustomFileInput.init()
    }

    // Buttons click actions
    ip = window.location.hostname;
    port = "52776"
    selected_file: string = 'carter';

    // Open all windows
    openWindows() {
        var time = 1000;
        var callNumber = 0
        var timeout = function () { return ++callNumber * time };

        setTimeout("openProduction()", timeout());

        setTimeout("openMessageTrace()", timeout());

        setTimeout("openUX()", timeout());
    }

    // Open a window with the given URL
    window_open(url) {
        var winReference = window.open();
        winReference.location = url;
        winReference.parent.focus();
    }

    openProduction() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/fhirhl7v2demo/EnsPortal.ProductionConfig.zen?$NAMESPACE=FHIRHL7V2DEMO&$NAMESPACE=FHIRHL7V2DEMO&IRISUserName=SuperUser&IRISPassword=password')
    }

    openMessageTrace() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/fhirhl7v2demo/EnsPortal.MessageViewer.zen?$NAMESPACE=FHIRHL7V2DEMO&IRISUserName=SuperUser&IRISPassword=password')
    }

    openUX() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/FHIRHL7V2DEMO/HS.Test.UI.FHIR.Main.cls')
    }

    PDFConversion() {
        this.window_open("http://localhost:52776/csp/healthshare/fhirhl7v2demo/fhir/stu3/Binary/1/$binary")
    }

    selectChangeHandler(event: any) {
        var file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            var input: HTMLInputElement = <HTMLInputElement>document.getElementById('HL7v2filePreview')
            input.value = fileReader.result.toString();
        }
        fileReader.readAsText(file);
    }

    HL7v2Import(fileInput) {
        var text = document.getElementById('send_action');
        var url = 'http://' + window.location.hostname + ':' + this.port + '/csp/demo/rest/sendfile' + '?IRISUserName=SuperUser&IRISPassword=password'
        text.innerHTML = ""
        var date = Date.now();
        var body = {
            content : fileInput,
            fileName : date.toString()
        }
        var httpOptions = {
            headers: new HttpHeaders(
                {
                "Content-Type": "application/json; charset=UTF-8",
                }
            )
        };
        var stringBody = JSON.stringify(body)
        
        this.http.post(url,  stringBody, httpOptions).subscribe((data: any) => {
            setTimeout(function(){ 
                var text = document.getElementById('send_action');
                text.innerHTML = "File sent to Intersystems IRIS for Health..." 
            }, 1000);
        }, error => {
            console.log("There was an error importing file", error);
            setTimeout(function(){ 
                var text = document.getElementById('send_action');
                text.innerHTML = "Error in sending file to Intersystems IRIS for Health..." 
            }, 1000);
        });
        
    }

}
