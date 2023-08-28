import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-create-squeal',
  templateUrl: './create-squeal.component.html',
  styleUrls: ['./create-squeal.component.scss'],
  imports: [SharedModule, RouterModule],
})
export class CreateSquealComponent {
  values: [] = [];
}
