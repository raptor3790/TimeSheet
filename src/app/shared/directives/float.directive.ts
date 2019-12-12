import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { NgControl } from '../../../../node_modules/@angular/forms';

@Directive({
  selector: '[appOnlyfloat]'
})
export class OnlyFloatDirective {

  @Input() floattype: string;
  // Allow decimal numbers. The \. is only allowed once to occur
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);

  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'Delete'];

  constructor(private el: ElementRef,
    private control: NgControl) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (event.keyCode === 37 || event.keyCode === 39) {
      return;
    }

    // Do not use event.keycode this is deprecated.
    // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    const current: string = this.el.nativeElement.value;
    // We need this because the current value on the DOM element
    // is not yet updated with the value from this event
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusout() {
    if (!this.floattype) {
      if (!!this.el.nativeElement.value) {
        let fPrecision: any = parseFloat(this.el.nativeElement.value) - parseInt(this.el.nativeElement.value, 10);
        if (fPrecision < 0.25) {
          fPrecision = '.00';
        } else if (fPrecision < 0.5) {
          fPrecision = '.25';
        } else if (fPrecision < 0.75) {
          fPrecision = '.50';
        } else if (fPrecision < 1) {
          fPrecision = '.75';
        }
        // https://stackoverflow.com/questions/40682717/angular-2-input-directive-modifying-form-control-value
        this.control.control.setValue(parseInt(this.el.nativeElement.value, 10) + fPrecision);
      }
    }
  }
}
