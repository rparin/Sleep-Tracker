import { TestBed } from '@angular/core/testing';

import { SleepLoggerService } from './sleep-logger.service';

describe('SleepLoggerService', () => {
  let service: SleepLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleepLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
