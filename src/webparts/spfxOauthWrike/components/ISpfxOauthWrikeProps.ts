import type { WrikeService } from '../services/WrikeService';

export interface ISpfxOauthWrikeProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  userDisplayName: string;
  wrikeService: WrikeService;
}
