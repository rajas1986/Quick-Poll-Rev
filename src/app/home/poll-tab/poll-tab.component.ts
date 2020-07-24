import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { INFERRED_TYPE } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-poll-tab',
  // templateUrl: './poll-tab.component.html',
  templateUrl: './poll-tab1.component.html',
  styleUrls: ['./poll-tab.component.css'],
})
export class PollTabComponent implements OnInit {
  @Output() submitted = new EventEmitter();
  @Input() poll;
  form = new FormGroup({
    questionControl: new FormControl('', Validators.required),
  });

  constructor() {}

  ngOnInit(): void {
    // console.log(this.poll);
  }
  onSubmit() {
    // console.log(this.form);
    this.submitted.emit(this.form);
  }
}
