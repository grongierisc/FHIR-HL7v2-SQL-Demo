import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

declare var imageMapResize: any;
declare var fs: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    constructor(private http: HttpClient) { }

    ngOnInit() {
        var fhir_img = document.getElementById('fhir_img');

        fhir_img.style.width = "80%";
        imageMapResize()
        this.previewfile('assets/sampleFiles/ADT_A01Carter.txt')
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
        //update the ui
        this.selected_file = event.target.value;
        var file = ''
        if (this.selected_file == "carter") {
            file = 'assets/sampleFiles/ADT_A01Carter.txt'
        } else if (this.selected_file == "massie") {
            file = 'assets/sampleFiles/ADT_A01Massie.txt'
        }
        this.previewfile(file)
        var text = document.getElementById('send_action');
        text.innerHTML = ""
    }

    previewfile(file = "") {
        var preview = document.getElementById('hl7file');
        fetch(file)
            .then(response => response.text())
            .then(text => (text = text.replace(/(?:\r\n|\r|\n)/g, '<br />')))
            .then(text => (preview.innerHTML = text));
    }

    HL7v2Import() {
        console.log("clicked HL7v2Import ");
        var text = document.getElementById('send_action');
        var url = 'http://' + window.location.hostname + ':' + this.port + '/csp/demo/rest/' + this.selected_file + '?IRISUserName=SuperUser&IRISPassword=password'
        // var url = 'http://' + window.location.hostname + ':' + this.port + '/csp/demo/rest/' + this.selected_file 
        this.http.get(url).subscribe((data: any) => {
        }, error => {
            console.log("There was an error importing file", error);
        });
        text.innerHTML = ""
        setTimeout(function(){ 
            var text = document.getElementById('send_action');
            text.innerHTML = "File sent to Intersystems IRIS for Health..." 
        }, 1000);
    }

}
