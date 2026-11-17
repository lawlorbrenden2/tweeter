// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface FollowRequest extends TweeterRequest {
  readonly userToFollow: string;
}