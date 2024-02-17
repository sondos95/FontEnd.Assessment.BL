import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  listFileName: any = '';
  errorMessage = '';
  arrayBuffer: any;
  fileContent: string = '';
  @ViewChild('inputFile') inputFile :any;

  ngOnInit(): void {
  }
  deleteFile() {
    this.listFileName = '';
   this.inputFile.nativeElement.files = null;
  }
  fileChange(e:any) {
    debugger
    this.errorMessage = '';
    let file = e.target.files[0];
    console.log('size', file.size);
    var size = Number((file.size / 1000000).toFixed(0));
    if(size > 0){
    if (size >= 1) {
      this.errorMessage = "Only accept files with size less than 5 mb";
    } else {
      //get file extension to check in it
      var extension = file.name.split('?')[0].split('.').pop();
      if (extension != 'txt') {
        this.errorMessage = "Only allow Text File";
      } else {
        debugger
        this.listFileName = file.name;
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          debugger
          var text = fileReader.result;
          console.log(text);
          this.fileContent = text.toString();
        };
        fileReader.readAsText(file);
      }
    }
  }else{
    this.errorMessage = "This file is empty , please check again";
    this.deleteFile();
  }
  }
}
