import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-list-image',
  templateUrl: './list-image.component.html',
  styleUrls: ['./list-image.component.css']
})
export class ListImageComponent implements OnInit {
  term = '';
  subscription: Subscription = new Subscription();
  listImages: any[] = [];
  imagesPerPage = 24;
  actualPage = 1;
  calculatePages = 0;

  constructor(private _imageService: ImageService) {
    this.subscription = this._imageService.getSearchTerm().subscribe({
      next: data => {
        this.term = data;
        this.actualPage = 1;
        this.obtainImages();
      },
      error: error => {
        this._imageService.setError('Ocurrió un error');
      }
    });
  }

  ngOnInit(): void {
  }

  obtainImages() {
    this._imageService.getImages(this.term, this.imagesPerPage, this.actualPage).subscribe({
      
      next: data => {
        if (data.hits.length === 0) {
          this._imageService.setError('No encontramos ningún resultado');
          return;
        }

        this.calculatePages = Math.ceil(data.totalHits / this.imagesPerPage);
        this.listImages = data.hits;
      },
      error: error => {
        this._imageService.setError('Ocurrió un error');
      }
    });
  }

  previousPage() {
    this.actualPage--;
    this.listImages = [];
    this.obtainImages();
  }

  nextPage() {
    this.actualPage++;
    this.listImages = [];
    this.obtainImages();
  }

  previousPageClass() {
    if (this.actualPage === 1) {
      return false;
    } else {
      return true;
    }
  }

  nextPageClass() {
    if (this.actualPage === this.calculatePages) {
      return false;
    } else {
      return true;
    }
  }
}
