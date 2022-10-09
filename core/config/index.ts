import { TreatConfig } from "../TreatCore";

export default class ApplicationConfig implements TreatConfig {
  chains: { label: string; chain_id: string; name: string }[];
  prefix = "treat-v3-";
}
