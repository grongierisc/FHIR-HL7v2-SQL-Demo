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

    // Parameters
    ip = window.location.hostname;
    port = "52776"

    HL7fileForm : FormGroup;
    messageViewerHidden = true;

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

    openTransformation() {
        // this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/FHIRHL7V2DEMO/HS.Test.UI.FHIR.Main.cls')
    }
    
    openProcess() {
        // this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/FHIRHL7V2DEMO/HS.Test.UI.FHIR.Main.cls')
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
        text.innerHTML = ""

        if (fileInput == "") {
            setTimeout(function(){ 
                text.style.color = "#CC0000"
                text.innerHTML = "Please select a file or fill in the textarea"
            }, 100);
            return
        }

        var url = 'http://' + window.location.hostname + ':' + this.port + '/csp/demo/rest/sendfile' + '?IRISUserName=SuperUser&IRISPassword=password'
        
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
            var that = this;
            var send_output =  function(color : string, text : string, hidden : boolean) {
                var p = document.getElementById('send_action');
                p.style.color = "#3f9937"
                p.innerHTML = "HL7v2 successfully sent to Intersystems IRIS for Health." 
                that.messageViewerHidden = hidden
            }
            setTimeout(send_output)
        }, error => {
            console.log("There was an error importing file", error);
            setTimeout(function(){ 
                var text = document.getElementById('send_action');
                text.style.color = "#CC0000"
                text.innerHTML = "Error in sending HL7v2 to Intersystems IRIS for Health." 
            }, 1000);
        });
        
        
    }

}
