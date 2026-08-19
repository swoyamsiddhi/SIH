export * from './client';
export * from './athletes';
export * from './assessments';
export * from './hardware';
export * from './scouts';
export * from './events';
export * from './admin';

import { athletesApi } from './athletes';
import { eventsApi } from './events';
import { AssessmentService as assessmentsApi } from './assessments';
import { hardwareApi } from './hardware';
import { adminApi } from './admin';

export const api = {
  athletes: athletesApi,
  events: eventsApi,
  assessments: assessmentsApi,
  hardware: hardwareApi,
  admin: adminApi
};
