// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface UnfollowRequest extends TweeterRequest {
  readonly userToUnfollow: string;
}