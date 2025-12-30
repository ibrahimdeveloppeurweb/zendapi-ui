import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input()
  cookie: string = "";
  advance: boolean = true;

  @Input()
  typeRow: any[];
  @Input()
  inputs: FormField<string>[] = [];
  @Input() type: boolean = false;
  @Output() filterEvent = new EventEmitter<any>();
  @Output() typeEvent = new EventEmitter<string>();
  @Output() onSearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onPreview = new EventEmitter<any>();

  topInputs: FormField<string>[] = [];
  bottomInputs: FormField<string>[] = [];


  constructor(private formBuild: FormBuilder) { }

  ngOnInit(): void {
    const group: any = {};
    group["type"] = new FormControl(this.typeRow[0].value);

    this.inputs.forEach(input => {
      group[input.key] = new FormControl(input.value || null);
    });
    this.form = new FormGroup(group);
    this.onSearchChange.emit(this.form);

    // if (this.typeRow.length === 1) {
    //   this.form.controls["type"].disable();
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.form && this.typeRow.length === 1) {
      this.form.controls['type'].setValue(this.typeRow[0].value);
    }
  }

  public types() {
    const type = this.form.value.type;
    this.form.reset();
    this.f.type.setValue(type);
    this.typeEvent.emit(type);
  }

  public colNumber(arr: FormField<string>[]): number {
    const len = arr.length;
    return len > 0 ? 12 / len : null;
  }

  clear() {
    this.form.reset();
  }

  public filters() {
    this.filterEvent.emit(this.form.value);
  }

  public preview() {
    this.onPreview.emit(this.form.value);
  }

  get f() {
    return this.form.controls;
  }
}

export class FormField<T> {
  value: T;
  key: string;
  label: string;
  controlType: string;
  type: string;
  top: boolean;
  multiple: boolean;
  visible: boolean;
  groups: string[];
  options: { key: string; value: string }[];
  finderParams: {
    bindLabel?: string;
    bindValue?: string;
    namespace: string;
    class: string;
    groups: string[];
  }
  column: number;

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      controlType?: string;
      type?: string;
      top?: boolean;
      multiple?: boolean;
      visible?: boolean;
      groups?: string[];
      options?: { key: string; value: string }[];
      finderParams?: {
        bindLabel?: string;
        bindValue?: string;
        namespace: string;
        class: string;
        groups: string[];
      }
      column?: number;
    } = {}
  ) {

    if (options.controlType === 'finder' && options.finderParams == null) {
      throw new Error("finderParams ne doit pas être null si le type de champs est 'finder'");
    }
    this.value = options.value;
    this.key = options.key || "";
    this.label = options.label || "";
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.top = options.top == null ? true : options.top;
    this.multiple = options.multiple == null ? false : options.multiple;
    this.groups = options.groups || [];
    this.options = options.options || [];
    this.finderParams = options.finderParams
    this.visible = options.visible ?? true
    this.column = options.column;
  }
}

