import { SlaRule } from '../types';

export const DEFAULT_SLA_RULES: SlaRule[] = [
  {
    stage: 'Truck check-in',
    responsibleParty: 'APMC',
    demoSlaMinutes: 5,
    escalatesTo: 'APMC Supervisor',
  },
  {
    stage: 'Unloading',
    responsibleParty: 'Load Owner',
    demoSlaMinutes: 60,
    escalatesTo: 'APMC',
  },
  {
    stage: 'Truck release',
    responsibleParty: 'APMC',
    demoSlaMinutes: 10,
    escalatesTo: 'Supervisor',
  },
  {
    stage: 'Load confirmation',
    responsibleParty: 'Load Owner',
    demoSlaMinutes: 15,
    escalatesTo: 'Coordinator',
  },
  {
    stage: 'Loading',
    responsibleParty: 'Load Owner',
    demoSlaMinutes: 60,
    escalatesTo: 'APMC',
  },
  {
    stage: 'Departure',
    responsibleParty: 'Driver',
    demoSlaMinutes: 15,
    escalatesTo: 'Coordinator',
  },
  {
    stage: 'Delivery',
    responsibleParty: 'Receiver',
    demoSlaMinutes: 30,
    escalatesTo: 'Load Owner',
  },
];

export function getSlaForStage(stage: string): SlaRule | undefined {
  return DEFAULT_SLA_RULES.find((r) => r.stage.toLowerCase() === stage.toLowerCase());
}
