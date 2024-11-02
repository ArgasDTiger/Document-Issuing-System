import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isVisible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = '';
  @Input() cancelText = '';
  @Input() isConfirmDisabled = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
