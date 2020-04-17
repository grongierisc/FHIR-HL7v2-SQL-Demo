import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
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

    toast_options:GlobalConfig;

    constructor(private http: HttpClient, private toastr: ToastrService) {
        this.HL7fileForm = new FormGroup({
            HL7fileUpload : new FormControl(),
            HL7v2filePreview : new FormControl(""),
        })
        this.toast_options = this.toastr.toastrConfig;
    }

    ngOnInit() {
        var fhir_img = document.getElementById('fhir_img');

        fhir_img.style.width = "80%";
        imageMapResize()
        bsCustomFileInput.init()
    }

    // Open a window with the given URL
    window_open(url: any) {
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

    openTransformationIN() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/fhirhl7v2demo/EnsPortal.DTLEditor.zen?DT=HS.Hub.Standalone.HL7.DTL.SubTransform.PD1ToSDA3.dtl&IRISUserName=SuperUser&IRISPassword=password')
    }
    
    openTransformationOUT() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/fhirhl7v2demo/EnsPortal.DTLEditor.zen?DT=HS.FHIR.DTL.SDA3.vR4.Patient.Patient.dtl&IRISUserName=SuperUser&IRISPassword=password')
    }

    openUX() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/healthshare/FHIRHL7V2DEMO/fhirconfig/index.html#/server-config')
    }

    openSQL() {
        this.window_open('http://' + this.ip + ':' + this.port + '/csp/sys/exp/%25CSP.UI.SQL.QueryBuilderWindow.cls?$NAMESPACE=FHIRHL7V2DEMO&ClassFilter=&ColumnType=2&$ID1=SELECT%20%0A*%0AFROM HSFHIR_I0001_S.Patient&zenLaunch=1')
    }

    // Open all windows
    openWindows() {
        this.openUX()
        this.openTransformationOUT()
        this.openTransformationIN()
        this.openMessageTrace()
        this.openProduction()   
    }

    PDFConversion() {
        this.window_open("http://localhost:52776/csp/sys/exp/%25CSP.UI.Portal.SQL.Home.zen?$NAMESPACE=FHIRHL7V2DEMO&$NAMESPACE=FHIRHL7V2DEMO")
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

    open_toast(title:string, message:string, type:string) {
        this.toast_options.positionClass = "toast-bottom-center"
        if (type == "success") {
            this.toastr.success(message, title);
        } else {
            this.toastr.error(message, title);
        }
    } 

    HL7v2Import(fileInput: string) {
        var text = document.getElementById('send_action');
        text.innerHTML = ""

        if (fileInput == "") {
            setTimeout(function(){ 
                text.style.color = "#CC0000"
                text.innerHTML = "Please select a file or fill in the textarea"
            }, 100);
            return
        }

        var url = 'http://' + window.location.hostname + ':' + this.port + '/csp/demo/rest/sendfile'
        
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
                // p.innerHTML = "HL7v2 successfully sent to Intersystems IRIS for Health." 
                that.messageViewerHidden = false
                that.open_toast("Success", "HL7v2 successfully sent to Intersystems IRIS for Health.", "success")
            }
            setTimeout(send_output)
        }, error => {
            var that = this;
            console.log("There was an error importing file", error);
            setTimeout(function(){ 
                var text = document.getElementById('send_action');
                text.style.color = "#CC0000"
                // text.innerHTML = "Error in sending HL7v2 to Intersystems IRIS for Health." 
                that.open_toast("Error in sending HL7v2 to Intersystems IRIS for Health.", error, "error")

            }, 1000);
        });
        
        
    }

}
