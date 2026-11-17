// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest } from "./TweeterRequest";

export interface FollowCountRequest extends TweeterRequest {
  readonly userAlias: string;
}