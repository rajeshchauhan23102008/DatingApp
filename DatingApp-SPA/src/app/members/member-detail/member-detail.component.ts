import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

    user: User;

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.data.subscribe(data => {
            this.user = data['user'];
        });
        //this.loadUser();

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                thumbnailsColumns: 3,
                imageAnimation: NgxGalleryAnimation.Slide,
                imagePercent: 100,
                preview: true
            }
        ];

       this.galleryImages = this.getImagesUrl();
    }

    getImagesUrl() {

        const imagesUrl = [];

        for (let i = 0; i < this.user.photos.length; i++) {

            imagesUrl.push({
                small: this.user.photos[i].url,
                medium: this.user.photos[i].url,
                big: this.user.photos[i].url,
                description: this.user.knownAs
            });
        }

        return imagesUrl;

    }


    // members/id
    // loadUser() {
    //     //console.log(this.route.snapshot.params['id'], +this.route.snapshot.params['id']);

    //     this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
    //         user => {
    //             this.user = user;
    //         },
    //         error => {
    //             this.alertify.error(error);
    //         }
    //     );
    // }
}
