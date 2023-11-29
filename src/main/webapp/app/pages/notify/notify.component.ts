import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, SharedModule } from 'primeng/api';
import { SquealService } from 'app/entities/squeal/service/squeal.service';

@Component({
  selector: 'jhi-notify',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  frequency = ' * * * * * ';
  constructor(private squealService: SquealService, private messageService: MessageService) {}
  ngOnInit(): void {
    console.log('notify');
  }

  cronValidate(): void {
    console.log('cron');
    this.squealService.cronValidate().subscribe(r => {
      console.log(r);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cron Validated' });
    });
  }
}
