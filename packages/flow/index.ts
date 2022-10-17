export default class Flow {}

export interface IFlow {
  activeStep: string;
  steps: Array<object>;

  start(): void;
  finish(): void;

  resetStep(step_id: string): void;
  finish_step(step_id: string, data: object): void;

  prevStep(): any;
  nextStep(): any;
}
