import { TestBed } from '@angular/core/testing';

import { Web3clientService } from './web3client.service';

describe('Web3clientService', () => {
  let service: Web3clientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3clientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
