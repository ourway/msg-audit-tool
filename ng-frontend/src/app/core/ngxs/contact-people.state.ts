import { State, Selector, Action, StateContext, createSelector, NgxsOnInit } from '@ngxs/store';
import { patch, updateItem, removeItem, append } from '@ngxs/store/operators';
import { Injectable } from '@angular/core';
import * as shortid from 'shortid';
import { ContactPerson } from '../data/models/contact-person.model';
import { CONTACT_PEOPLE } from '../data/examples/contact-people';
import {
  AddContactPerson,
  DeleteContactPerson,
  UpdateContactPerson,
} from './actions/contact-person.action';
import { getId } from './audit.state';
import { CoreService } from '../http/core.service';

export interface ContactPersonStateModel {
  contactPeople: ContactPerson[];
}

/**
 * State for managing the contact people of the application.
 *
 * Has: Action handlers to read, write, update and delete a contact person.
 * Static and dynamic selectors to select contact people.
 */
@State<ContactPersonStateModel>({
  name: 'contactPerson',
})
@Injectable()
export class ContactPersonState implements NgxsOnInit {
  constructor(private coreService: CoreService) {}

  ngxsOnInit({ patchState }: StateContext<ContactPersonStateModel>) {
    this.coreService.getContactPersons().subscribe(contactPeople => {
      patchState({ contactPeople });
    });
  }

  @Selector()
  static contactPeople(state: ContactPersonStateModel) {
    return state.contactPeople;
  }

  static contactPerson(id: number) {
    return createSelector([ContactPersonState], (state: ContactPersonStateModel) => {
      return state.contactPeople.find(x => x.id === id);
    });
  }

  @Action(AddContactPerson)
  addContactPerson(
    { setState }: StateContext<ContactPersonStateModel>,
    { contactPerson }: AddContactPerson,
  ) {
    this.coreService.postContactPerson(contactPerson).subscribe(contactPerson => {
      setState(
        patch({
          contactPeople: append<ContactPerson>([{ ...contactPerson, id: getId() }]),
        }),
      );
    });
  }

  @Action(UpdateContactPerson)
  updateContactPerson(
    { setState }: StateContext<ContactPersonStateModel>,
    { id, contactPerson }: UpdateContactPerson,
  ) {
    this.coreService.updateContactPerson({ ...contactPerson, id }).subscribe(contactPerson => {
      setState(
        patch({
          contactPeople: updateItem<ContactPerson>(x => x.id === contactPerson.id, contactPerson),
        }),
      );
    });
  }

  @Action(DeleteContactPerson)
  deleteContactPerson(
    { setState }: StateContext<ContactPersonStateModel>,
    { id }: DeleteContactPerson,
  ) {
    setState(
      patch({
        contactPeople: removeItem<ContactPerson>(x => x.id === id),
      }),
    );
  }
}
