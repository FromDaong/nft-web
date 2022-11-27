import Avvvatars from "avvvatars-react";

export default function UserAvatar({ value, size }) {
  return <Avvvatars border shadow size={size} value={value} style="shape" />;
}
