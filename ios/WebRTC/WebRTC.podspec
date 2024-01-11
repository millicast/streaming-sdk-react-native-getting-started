Pod::Spec.new do |s|
  s.name             = "WebRTC"
  s.version          = "0.0.112"
  s.summary          = "WebRTC dependency"
  s.homepage         = "https://github.com/CoSMoSoftware/libwebrtc"
  s.license          = { :type => "MIT", :text => "MIT License" }
  s.author           = { "Aravind Raveendran" => "aravind.raveendran@dolby.com" }
  s.source           = { :http => 'file:' + __dir__ + '/../libWebRTC.zip' }
  s.ios.deployment_target   = "12.4"
  s.tvos.deployment_target  = "12.4"
  s.vendored_frameworks     = [ 'libWebRTC/Frameworks/WebRTC.xcframework' ]
  s.source_files            = "libWebRTC/Frameworks/*.{h,m,swift}"
  s.preserve_paths          = "*"
end
