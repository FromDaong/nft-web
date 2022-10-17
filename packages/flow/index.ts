import { default_machine } from "./machines/default";
import { IFlow, IFlowBlock } from "./types";
export default class Flow implements IFlow {
  api_key: string;
  steps: Array<{ block: IFlowBlock; id: string }>;
  activeStep: string;
  active: boolean;
  id: string;

  /**
   * @description Initialize a flow.
   * @param {string} client_key
   * @return {Promise<IFlowBlock>} index
   */
  constructor(client_key: string) {
    this.api_key = client_key;
    if (!this.verify_api_key) throw Error("Invalid API Key");
    this.hydrate();
  }

  async hydrate() {
    return "Resolved";
  }

  /**
   * @description Hydrates step with ID.
   * @return {Promise<IFlowBlock>} index
   */
  async hydrateStep(id: string): Promise<IFlowBlock> {
    let step_meta: IFlowBlock;
    setTimeout(() => {
      step_meta = {
        id,
        tags: ["step", "user", "session", "new"],
        title: "Become a creator today",
        description: "Upgrade to a creator profile and start making money now.",
        machine: default_machine,
      };
    }, 1000);

    return step_meta;
  }

  /**
   * @description Returns total number of steps in the flow.
   * @return {number} index
   */
  getTotalSteps(): number {
    return this.steps.length;
  }

  /**
   * @description Returns step data by ID.
   * @param {string} id
   * @return {IFlowBlock} index
   */
  getStepById(id: string): IFlowBlock {
    const step = this.steps.find((step) => step.id === id);
    if (step) return step.block;
    throw Error(`Step with id: ${id} was not found`);
  }

  /**
   * @description Returns ID of step with given index.
   * @return {number} index
   */
  getIdForStepAt(index: number): string {
    if (this.steps.length < index - 1)
      throw Error(`Step with index: ${index} was not found`);

    return this.steps[index].id;
  }

  /**
   * @description Returns index of step with given ID.
   * @return {string} id
   */
  getStepIndexById(id: string): number {
    const index = this.steps.indexOf(this.steps.find((step) => step.id === id));

    if (!index || index === -1)
      throw Error(`Step with id: ${this.activeStep} was not found`);

    return index;
  }

  /**
   * @description Returns currently active step.
   * @return {IFlowBlock}
   */
  getActiveStep(): IFlowBlock {
    const step = this.getStepById(this.activeStep);
    return step;
  }

  /**
   * @description Update step data by ID.
   * @return {number} index
   */
  getActiveStepIndex(): number {
    const index = this.steps.indexOf(
      this.steps.find((step) => step.id === this.activeStep)
    );

    if (!index || index === -1)
      throw Error(`Step with id: ${this.activeStep} was not found`);

    return index;
  }

  /**
   * @description Update step data by ID.
   * @param {string} id
   * @param {IFlowBlock} update
   */
  private updateStepDataById(id: string, update: IFlowBlock) {
    let step: IFlowBlock = this.getStepById(id);
    if (!step) throw Error("No step with given ID found");

    step = {
      ...update,
    };
    const step_index = this.getStepIndexById(id);
    this.steps[step_index] = { block: step, id };
  }

  /**
   * @description Returns filled values for all steps in a flow.
   * @params {string} id
   * @returns {Array<{id: string; data: object}>}
   */
  getAllStepsData(): Array<{ id: string; data: object }> {
    const data = this.steps.flatMap((step) => ({
      id: step.id,
      data: { ...(step.block.data ?? {}) },
    }));

    return data;
  }

  /**
   * @description Returns filled values for all steps in a flow.
   * @params {string} flow_id
   * @returns {Array<{id: string; data: object}>}
   */
  private async getFlowStepsById(
    flow_id: string
  ): Promise<Array<{ id: string; block: IFlowBlock }>> {
    // TODO: Implement logic to get steps from server
    throw Error("NOT Iplemented");
    return;
  }

  /**
   * @description Update the default values for the steps.
   * @param {string} id
   * @param {Array<{ id: string; block: IFlowBlock }>} steps
   *
   */
  private setFlowConfig(
    flow_id: string,
    steps: Array<{ id: string; block: IFlowBlock }>
  ) {
    this.id = flow_id;
    this.steps = steps;
  }

  /**
   * @description Begin a flow with first step.
   * @param {string} flow_id
   */
  start(flow_id: string): void {
    if (this.steps.length === 0)
      throw Error("Cannot start flow with zero steps");

    this.getFlowStepsById(flow_id).then((flows) => {
      this.setFlowConfig(flow_id, flows);
    });

    this.id = flow_id;
    this.activeStep = this.getIdForStepAt(0);
    this.active = true;
    throw new Error("Method not implemented.");
  }

  /**
   * @description Begin a flow from step with ID.
   * @params {string} id
   */
  startAtId(id: string): void {
    const stepExists = !!this.getStepById(id);
    if (!stepExists) throw Error("Step with that ID could not be found");

    const stepIndex = this.getStepIndexById(id);
    if (stepIndex === 0 || stepIndex < 0)
      throw Error("Cannot start flow with zero steps");

    this.activeStep = id;
    this.active = true;
    throw new Error("Method not implemented.");
  }

  /**
   * @description Begin a flow from index.
   * @params {number} index
   */
  startAtIndex(index: number): void {
    if (this.steps.length < 0 || index < 0)
      throw Error("Index with that index could not be found, Index:" + index);

    this.activeStep = this.getIdForStepAt(index);
    this.active = true;
    throw new Error("Method not implemented.");
  }

  /**
   * @description Finalise flow and submit flow data to server.
   */
  finish(): void {
    this.active = false;
    this.submit();
    throw new Error("Method not implemented.");
  }

  /**
   * @description Reset the data for given step_id. It also resets the draft data values.
   * @param {string} step_id
   */
  resetStep(step_id: string): void {
    const step = this.getStepById(step_id);
    this.updateStepDataById(step_id, { ...step, data: {} });
  }

  /**
   * @description Save data for given step and update the draft data values.
   * @param {string} step_id
   * @param {object} data
   */
  save_step_data(step_id: string, data: object): void {
    const step = this.getStepById(step_id);
    step.data = { ...data };

    if (this.getActiveStepIndex() !== this.steps.length)
      this.activeStep = this.getIdForStepAt(this.steps.length);

    this.updateStepDataById(step_id, { ...step, data });
    this.save_draft();
  }

  /**
   * @description Move to the previous step.
   */
  prevStep() {
    if (this.getActiveStepIndex() === 0) return;

    this.activeStep = this.getIdForStepAt(this.getActiveStepIndex() - 1);
  }

  /**
   * @description Move to the next step.
   */
  nextStep() {
    if (this.getActiveStepIndex() === this.steps.length) return this.finish();

    this.activeStep = this.getIdForStepAt(this.getActiveStepIndex() + 1);
  }

  /**
   * @description Save current state to database drafts.
   */
  async save_draft() {
    return;
  }

  /**
   * @description Submit flow data to server.
   */
  private async submit() {
    return;
  }

  /**
   * @description Verify client api_key.
   */
  private verify_api_key(): boolean {
    return true;
  }
}
