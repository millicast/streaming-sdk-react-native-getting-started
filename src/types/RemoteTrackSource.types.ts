import { ViewProjectSourceMapping } from '@millicast/sdk';

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export interface RemoteTrackSource {
  audioMediaId?: string;
  mediaStream: MediaStream;
  projectMapping: ViewProjectSourceMapping[];
  quality?: StreamQuality;
  sourceId?: string;
  videoMediaId?: string;
}
