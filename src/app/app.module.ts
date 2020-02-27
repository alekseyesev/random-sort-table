import {
  Component,
  NgModule,
  Input,
  Output,
  OnInit,
  OnChanges,
  EventEmitter
} from "@angular/core";
import * as Rx from "rxjs";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ApiService } from "./ApiService";

@Component({
  // tslint:disable-next-line
  selector: "[header]",
  template: `
    <th>№</th>
    <th>Name</th>
    <th>Score</th>
    <th>Note</th>
  `
})
export class HeaderComponent {}

@Component({
  // tslint:disable-next-line
  selector: "[item-detail]",
  template: `
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.score }}</td>
    <td>
      <input size="7" [ngModel]="note" (ngModelChange)="onNoteChange($event)" />
    </td>
  `
})
export class RowComponent implements OnChanges {
  @Input() item;
  @Input() note: string;
  @Output() noteChange = new EventEmitter<string>();
  onNoteChange(note: string) {
    this.note = note;
    this.noteChange.emit(note);
  }
  ngOnChanges() {
    console.log("inputs changes");
  }
}

@Component({
  selector: "[item-list]",
  providers: [ApiService],
  template: `
    <tr
      *ngFor="let item of items"
      item-detail
      [(note)]="notes[item.id]"
      [item]="item"
    ></tr>
  `
})
export class TbodyComponent implements OnInit {
  items: {
    name: string;
    score: number;
  }[];
  notes: Array<string> = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.handleChanges(changes => {
      this.items = this.calcScore(changes);
    });
  }

  calcScore(items) {
    return items.map(item => ({
      ...item,
      score: Math.round((item.rate / 100) * 5),
      note: this.notes[item.id]
    }));
  }
}

@Component({
  selector: "app-component",
  providers: [ApiService],
  template: `
    <table border="2" cellpadding="5">
      <thead>
        <tr header></tr>
      </thead>
      <tbody item-list></tbody>
    </table>
  `
})
export class AppComponent {}

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, TbodyComponent, RowComponent, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
