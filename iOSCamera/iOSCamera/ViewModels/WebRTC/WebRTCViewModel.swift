//
//  WebRTCViewModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/06.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import SwiftUI

class WebRTCViewModel: ObservableObject {
  // MARK: Properties

  @Published var isSignaling: Bool = false

  @Published var signalingState: String = RTCSignalingState.stable.description.capitalized

  @Published var hasRemoteSdp: Bool = false
    
  @Published var numberOfLocalCandidate: Int = 0
    
  @Published var numberOfRemoteCandidate: Int = 0
  
  @Published var URL: String = ""
  
  @Published var showAlert: Bool = false
    
  var alert: AlertModel?
  
  var model: WebRTCModel

  var dialog: Alert {
    return Alert(
      title: Text(self.alert?.title ?? ""),
      message: Text(self.alert?.message ?? ""),
      dismissButton: .default(
        Text(self.alert?.primaryButtonTitle ?? ""),
        action: { self.alert?.primaryAction?() }
      )
    )
  }
  
  // MARK: Init

  init() {
    self.model = WebRTCModel()
    self.model.delegate = self
    self.model.prepare()
  }
  
  // MARK: Methods
  
  func start() {
    self.model.start()
  }
  
  func restart() async {
    self.model = WebRTCModel()
    self.model.delegate = self
    self.model.prepare()
  }
}
