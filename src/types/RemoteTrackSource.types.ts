import { ViewProjectSourceMapping, LayerInfo } from '@millicast/sdk';

export type SimulcastQuality = {
  simulcastLayer?: LayerInfo; // Auto has an idx of null
  streamQuality: string;
};

export interface RemoteTrackSource {
  audioMediaId?: string;
  mediaStream: MediaStream;
  projectMapping: ViewProjectSourceMapping[];
  quality?: string;
  sourceId?: string;
  videoMediaId?: string;
  streamQualities?: SimulcastQuality[];
}
