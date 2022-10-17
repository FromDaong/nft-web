export default class Logger {
  config: LoggerConfig;
  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private generateDate(): number {
    switch (this.config.date_format) {
      case "JS":
        return Date.now();
      case "UNIX":
        return Date.now() / 1000;
      default:
        return Date.now() / 1000;
    }
  }

  private serialize(data: any): string {
    if (typeof data === "string") return data;
    let serialized: string;
    try {
      serialized = JSON.stringify(data);
    } catch (err) {
      serialized = `${data}`;
    }

    return serialized;
  }

  static generateID(seed: number) {
    return "";
  }

  log(content: any) {
    const event = {
      content: this.serialize(content),
      created_at: this.generateDate(),
      id: Logger.generateID(10),
    };
  }

  private submit(data) {
    throw Error("NOT Implemented");
  }
}

export type LoggerConfig = {
  date_format: "UNIX" | "JS";
};
