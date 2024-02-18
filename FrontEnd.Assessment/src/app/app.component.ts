import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  errorMessage = '';
  fileContent: string = '';
  wordsCount = new Map<string, number>();
  title = 'FrontEnd.Assessment';
  @ViewChild('inputFile') inputFile: any;

  ngOnInit(): void {
  }
  fileChange(e: any) {
    this.errorMessage = '';
    let file = e.target.files[0];
    if (file.size > 0) {
      var size = file.size / 1024 / 1024;
      if (size >= 1) {
        this.errorMessage = "Only accept files with size less than 5 mb";
      } else {
        //get file extension to check in it
        var extension = file.name.split('?')[0].split('.').pop();
        if (extension != 'txt') {
          this.errorMessage = "Only allow Text File";
        } else {
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
            var text = fileReader.result;
            console.log(text);
            this.fileContent = text.toString();
            this.wordsCountCalculate();
          };
          fileReader.readAsText(file);
        }
      }
    } else {
      this.errorMessage = "This File is Empty, Please Check again."
    }
  }

  wordsCountCalculate() {
    var words = this.fileContent.split(' ');
    words.forEach((word: string) => {
      if (this.wordsCount.has(word)) {
        this.wordsCount.set(word, this.wordsCount.get(word) + 1)
      } else {
        this.wordsCount.set(word, 1)
      }
    })
  }
}
