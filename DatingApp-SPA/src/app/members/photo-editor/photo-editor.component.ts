import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../_services/auth.service';
import { AlertifyService } from '../../_services/alertify.service';
import { Photo } from '../../_models/photo';
import { UserService } from '../../_services/user.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

    @Input() photos: Photo[];
    @Output() mainPhotoChanged = new EventEmitter<string>();

    uploader: FileUploader; // = new FileUploader({ url: URL });
    hasBaseDropZoneOver = false;

    constructor(private authService: AuthService, private alertify: AlertifyService, private userService: UserService) { }

    setUserMainPhoto(photo: Photo) {
        this.userService.setUserMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(
            () => {
                // this.alertify.success('photo successfully set to is main');
                const currentMainPhoto = this.photos.filter( p => p.isMain === true)[0];
                currentMainPhoto.isMain = false;

                photo.isMain = true;

                this.mainPhotoChanged.emit(photo.url);
            },
            error => {
                this.alertify.error(error);
            });
    }

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    ngOnInit() {
        this.initializeFileUploader();
    }

    initializeFileUploader() {
        this.uploader = new FileUploader({
            url: environment.apiBaseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
            authToken: 'Bearer ' + localStorage.getItem('token'),
            autoUpload: false,
            isHTML5: true,
            maxFileSize: 10 * 1024 * 1024,  // upto 10 MB file size allowed.
            removeAfterUpload: true,
            allowedFileType: ['image']
        });

        this.uploader.onAfterAddingFile = (fileItem) => { fileItem.withCredentials = false; };

        this.uploader.onSuccessItem = (item, response, status, headers) => {

            if (response) {
                const res: Photo = JSON.parse(response);
                // const photo = {
                //     id: res.id,
                //     url: res.url,
                //     isMain: res.isMain,
                //     description: res.description,
                //     dateAdded: res.dateAdded
                // };

                this.photos.push(res);
            } else {
                this.alertify.error('unable to upload the photos');
            }
        };
    }


}
