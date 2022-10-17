export default class ApplicationStateObserver {
  notification_tab_open: boolean;
  is_camera_enabled: boolean;
  is_mic_enabled: boolean;

  enable_av_device(device_id: "camera" | "mic" | "both" = "both"): boolean {
    throw Error("NOT Implemented");
  }

  is_chat_focused(chat_id: string): boolean {
    throw Error("NOT Implemented");
  }

  get_focused_chat(): boolean {
    throw Error("NOT Implemented");
  }

  is_currently_livestreaming(): boolean {
    throw Error("NOT Implemented");
  }

  is_watching_livestream(): boolean {
    throw Error("NOT Implemented");
  }

  get_livestream_host(stream_id: string): string {
    throw Error("NOT Implemented");
  }

  get_focused_livestream(): boolean {
    throw Error("NOT Implemented");
  }

  get_total_watching_livestream(stream_id: string): number {
    throw Error("NOT Implemented");
  }
}
