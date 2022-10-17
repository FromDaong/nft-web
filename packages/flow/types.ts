export interface IFlow {
  activeStep: string;
  steps: Array<object>;

  start(flow_id: string): void;
  finish(): void;

  resetStep(step_id: string): void;
  save_step_data(step_id: string, data: object): void;

  prevStep(): any;
  nextStep(): any;
}

export interface IFlowBlock {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  machine: object;
  data?: object;
}
