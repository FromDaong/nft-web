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

  private generateLogEvent(data: { level: string; content: string }) {
    const event = {
      content: this.serialize(data.content),
      timestamp: this.generateDate(),
      id: Logger.generateID(10),
      level: data.level,
    };

    return event;
  }

  log(content: any, level = "info") {
    const event = this.generateLogEvent({ level, content });
    console.info(event);
  }

  success(content) {
    const event = this.generateLogEvent({ level: "success", content });
    console.info(event);
  }

  info(content) {
    const event = this.generateLogEvent({ level: "info", content });
    console.info(event);
  }

  warn(content) {
    const event = this.generateLogEvent({ level: "warn", content });
    console.warn(event);
  }

  debug(content) {
    const event = this.generateLogEvent({ level: "debug", content });
    console.debug(event);
  }

  fatal(content) {
    const event = this.generateLogEvent({ level: "fatal", content });
    console.error(event);
  }

  trace(content) {
    const event = this.generateLogEvent({
      level: "fatal",
      content: `An error occured, here is the stack trace.\n\n${this.serialize(
        content
      )}`,
    });
    console.trace(event);
  }

  errorOccured(content) {
    this.fatal(`An error occured.\n${this.serialize(content)}`);
  }

  mutationSuccess(entity: string, initial: any, final: any) {
    this.success(
      `${entity} changed from ${this.serialize(initial)} to ${this.serialize(
        final
      )}`
    );
  }

  mutationFailed(entity: string, initial: any, final: any) {
    this.warn(
      `${entity} failed to update. \n\nFrom ${this.serialize(
        initial
      )} to ${this.serialize(final)}`
    );
  }

  private submit(data) {
    throw Error("NOT Implemented");
  }
}

export type LoggerConfig = {
  date_format: "UNIX" | "JS";
};
