//
//  HLSViewModel.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/01.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import Foundation
import SwiftUI

class HLSViewModel: ObservableObject {
  @Published var isConnected: Bool = false
  
  @Published var URL: String = "Not Available"
  
  @Published var showAlert: Bool = false

  let model: HLSModel = HLSModel()
  
  var connectionLabel: String {
    return self.isConnected ? "wifi.circle.fill" : "wifi.circle"
  }
  
  var connectionColor: Color {
    return self.isConnected ? .red : .white
  }

  var session: AVCaptureSession {
    return self.model.videoCapture.session
  }
  
  var alert: Alert {
    return Alert(
      title: Text(self.model.alertModel?.title ?? ""),
      message: Text(self.model.alertModel?.message ?? ""),
      dismissButton: .default(
        Text(self.model.alertModel?.primaryButtonTitle ?? ""),
        action: { self.model.alertModel?.primaryAction?() }
      )
    )
  }
  
  func start() {
    self.model.delegate = self
    self.model.start()
  }
}
