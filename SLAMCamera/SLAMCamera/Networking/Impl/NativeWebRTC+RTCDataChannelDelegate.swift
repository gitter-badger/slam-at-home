//
//  NativeWebRTC+RTCDataChannelDelegate.swift
//  SLAMCamera
//
//  Created by Shingo OKAWA on 2022/01/02.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//
import Foundation
import WebRTC

extension NativeWebRTC: RTCDataChannelDelegate {
  public func dataChannelDidChangeState(
    _ dataChannel: RTCDataChannel
  ) {
    debugPrint("dataChannel did change state: \(dataChannel.readyState)")
  }
    
  public func dataChannel(
    _ dataChannel: RTCDataChannel,
    didReceiveMessageWith buffer: RTCDataBuffer
  ) {
    self.delegate?.webRTC(self, didReceiveData: buffer.data)
  }
}
