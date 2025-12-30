import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-house-share',
  templateUrl: './house-share.component.html',
  styleUrls: ['./house-share.component.scss']
})
export class HouseShareComponent implements OnInit {
  @Input() item: any;
  @Input() url: string;
  googleMapsUrl: string;

  constructor(private modalService: NgbModal) {}
  ngOnInit(): void {
    
    
  }

  shareVia(platform: string): void {
    switch (platform) {
      case 'googleMapsUrl':
        const lat = this.item?.lat;
        const lng = this.item?.lng;
        if (lat && lng) {
          const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          window.open(googleMapsUrl, '_blank');
          break;
        }
      case 'whatsapp':
        const whatsappUrl = `https://api.whatsapp.com/send?text=Regardez%20cette%20localisation%20sur%20Google%20Maps:%20${this.url}`;
        window.open(whatsappUrl, '_blank');
        break;

      case 'email':
        const emailSubject = 'Partage de Localisation';
        const emailBody = `Voici la localisation que je voulais partager avec vous : ${this.url}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoUrl, '_blank');
        break;

      
    }
    this.modalService.dismissAll();
  }

  close(): void {
    this.modalService.dismissAll();
  }

}
