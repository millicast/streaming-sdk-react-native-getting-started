//
//  RCTAudioManager.h
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
NS_ASSUME_NONNULL_BEGIN

@interface RCTAudioManager : NSObject <RCTBridgeModule>
- (void)routeAudioThroughDefaultSpeaker;
@end

NS_ASSUME_NONNULL_END
