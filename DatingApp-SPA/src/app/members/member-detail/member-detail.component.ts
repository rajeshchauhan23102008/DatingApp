import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

    user: User;
    @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) {
    }

    ngOnInit() {

        this.route.data.subscribe(data => {
            this.user = data['user'];
        });

        this.route.queryParams.subscribe(
            params => {
                const tabId = params['tabId'];
                this.memberTabs.tabs[tabId > 0 ? tabId : 0].active = true;
            }
        );
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

    selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true;
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
