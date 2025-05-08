import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-features',
  imports: [NgIf, NgClass],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss'
})
export class FeaturesComponent implements OnInit {
  showTooltip = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.showTooltip = true; // Show the tooltip after 5 seconds
    }, 2000); 
  }
}


