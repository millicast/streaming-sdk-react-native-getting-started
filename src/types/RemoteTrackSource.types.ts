import { ViewProjectSourceMapping, LayerInfo } from '@millicast/sdk';

export type StreamQuality = 'Auto' | 'High' | 'Medium' | 'Low';

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: StreamQuality;
};

export interface RemoteTrackSource {
  audioMediaId?: string;
  mediaStream: MediaStream;
  projectMapping: ViewProjectSourceMapping[];
  quality?: StreamQuality;
  sourceId?: string;
  videoMediaId?: string;
  streamQualities?: SimulcastQuality[];
}
