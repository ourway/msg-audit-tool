import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { AuditRegistryState } from 'src/app/core/ngxs/audit-registry.state';
import { Observable } from 'rxjs';
import { ContactPerson } from 'src/app/core/data/models/contact-person.model';

@Component({
  selector: 'app-contact-people-list',
  templateUrl: './contact-people-list.component.html',
  styleUrls: ['./contact-people-list.component.scss'],
})
export class ContactPeopleListComponent implements OnInit {
  @Select(AuditRegistryState.contactPeople) contactPeople$: Observable<ContactPerson[]>;

  ngOnInit() {}
}
