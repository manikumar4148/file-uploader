import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { trackByDayOrWeekEvent } from 'angular-calendar/modules/common/util';

@Component({
  selector: 'app-fileuploader',
  templateUrl: './fileuploader.component.html',
  styleUrls: ['./fileuploader.component.scss']
})
export class FileuploaderComponent implements OnInit {
  options: UploaderOptions;
   files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;

  constructor() {
    this.options = { concurrency: 1, maxUploads: 3 };
    this.files = []; 
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
  }
  onUploadOutput(output: UploadOutput): void {
  switch (output.type) {
    case 'allAddedToQueue':
            break;
    case 'addedToQueue':
      if (typeof output.file !== 'undefined') {
        this.files.push(output.file);
      }
      break;
      case 'done':
        alert("file uploaded successfully");
        break;
  }
}

startUpload(): void {
  const event: UploadInput = {
    type: 'uploadAll',
    url: 'http://localhost:7000/fileupload',
    method: 'POST',
    data: { foo: 'bar' }
  };

  this.uploadInput.emit(event);
  console.log(this.files);
  
}

}

