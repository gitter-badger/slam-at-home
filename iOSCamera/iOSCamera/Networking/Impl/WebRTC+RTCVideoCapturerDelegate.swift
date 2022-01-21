//
//  WebRTC+RTCVideoCapturerDelegate.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/02.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import WebRTC

extension WebRTC: RTCVideoCapturerDelegate {
  public func capturer(_ capturer: RTCVideoCapturer, didCapture frame: RTCVideoFrame) {
    self.videoSource.capturer(capturer, didCapture: frame)
  }
}
