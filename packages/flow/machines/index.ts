export default class MachineDomainController {
  domain_id: string;

  constructor(domain_id: string) {
    this.domain_id = domain_id;
  }

  get_machine(machine_id: string, params: any) {
    throw Error("NOT Implemented");
  }

  set_machine(machine_id: string, params: any) {
    throw Error("NOT Implemented");
  }

  remove_machine(machine_id: string, params: any) {
    throw Error("NOT Implemented");
  }
}
