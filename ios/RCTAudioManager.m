//
//  RCTAudioManager.m
//

#import "RCTAudioManager.h"
#import <AVFoundation/AVFoundation.h>
#include <TargetConditionals.h>
#import <React/RCTLog.h>

@implementation RCTAudioManager

RCT_EXPORT_MODULE(AudioManager);

RCT_EXPORT_METHOD(routeAudioThroughDefaultSpeaker)
{
  NSError *error = nil;
  AVAudioSession *session = [AVAudioSession sharedInstance];
#if TARGET_OS_IOS
  [session setCategory:AVAudioSessionCategoryPlayAndRecord withOptions:AVAudioSessionCategoryOptionDefaultToSpeaker error:&error];
  
  if (error) {
    RCTLogInfo(@"Error setting category: %@",[error localizedDescription]);
  }
  
  [session overrideOutputAudioPort:AVAudioSessionPortOverrideSpeaker error:&error];

  if (error) {
    RCTLogInfo(@"Error setting speaker route override: %@",[error localizedDescription]);
  }

#else
  [session setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionMixWithOthers error:&error];
#endif
  
  if (error != NULL) {
    RCTLogInfo(@"Successfully routed audio through default speaker");
  }
}

@end
