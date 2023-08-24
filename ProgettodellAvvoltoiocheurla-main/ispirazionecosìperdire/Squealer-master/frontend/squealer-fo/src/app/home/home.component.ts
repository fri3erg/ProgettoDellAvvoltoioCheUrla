import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ComponentCacheService } from "app/services/component-cache.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedIndex = 0;
  parameters = {
    dataSource: []
  }
  constructor(private componentCacheService: ComponentCacheService) {}
  ngOnInit(): void {
      this.selectedIndex = 0;
  }
  ngOnDestroy(): void {
    this.componentCacheService.set(HomeComponent.name, this.parameters);
  }



}
