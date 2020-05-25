import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { defaultDialogOptions } from 'src/app/shared/components/dialogs/default-dialog-options';

@Component({
  selector: 'app-new-interview-dialog',
  templateUrl: './new-interview-dialog.component.html',
  styleUrls: ['./new-interview-dialog.component.scss'],
})
export class NewInterviewDialogComponent implements AfterViewInit {
  @ViewChild('dialog') dialog: TemplateRef<any>;
  dialogRef: NbDialogRef<any>;

  ngOnInit() {
    const idRegex = /\/audits\/([^\/]*)\/.*/gm;
    const id = idRegex.exec(this.router.url)[1];

    this.audit$ = this.store.select(AuditRegistryState.audit(id));
  }

  ngAfterViewInit() {
    this.dialogRef = this.dialogService.open(this.dialog, {
      ...defaultDialogOptions,
    });

    this.dialogRef.onClose.subscribe(() => {
      this.location.back();
    });
  }

  onSubmit() {
    // this.store.dispatch(new AddAudit(audit)).subscribe(() => this.dialogRef.close());
  }

  onCancel() {
    this.dialogRef.close();
  }
}
