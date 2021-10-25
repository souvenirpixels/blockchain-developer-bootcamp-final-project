import { TestBed } from '@angular/core/testing';

import { LDAPContractService } from './ldapcontract.service';

describe('LDAPContractService', () => {
  let service: LDAPContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LDAPContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
