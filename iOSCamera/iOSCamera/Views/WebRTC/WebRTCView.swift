//
//  WebRTCView.swift
//  iOSCamera
//
//  Created by Shingo OKAWA on 2022/02/07.
//  Copyright © 2022 Shingo OKAWA. All rights reserved.
//

import SwiftUI
import WebRTC

struct WebRTCView: View {
  @ObservedObject var viewModel: WebRTCViewModel = WebRTCViewModel()
  
  @State private var showSettings: Bool = false

  // swiftlint:disable identifier_name
//  func Connection() -> some View {
//    return Button(
//      action: { /* Do nothing. */ },
//      label: {
//        Image(systemName: self.viewModel.label)
//          .font(.system(size: 20, weight: .medium, design: .default))
//      })
//      .accentColor(self.viewModel.color)
//  }

//  func URL() -> some View {
//    return Text(self.viewModel.URL)
//  }

  var body: some View {
    GeometryReader { reader in
      ZStack {
        Color.black.edgesIgnoringSafeArea(.all)
        VStack {
          HStack {
//            Connection()
//            URL()
            Spacer()
            Button(
              action: {
                self.showSettings.toggle()
              },
              label: {
                Image(systemName: "gearshape")
                  .font(.system(size: 20, weight: .medium, design: .default))
              }
            )
            .accentColor(.white)
            .sheet(isPresented: self.$showSettings) {
              WebRTCSettingsView(viewModel: self.viewModel)
            }
          }
#if arch(arm64)
          WebRTCMTLVideoView(model: viewModel.model)
            .onAppear { viewModel.start() }
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
#else
          WebRTCEAGLVideoView(model: viewModel.model)
            .onAppear { viewModel.start() }
            .alert(isPresented: $viewModel.showAlert, content: { self.viewModel.dialog })
#endif
        }
      }
    }
  }
}

struct WebRTCView_Previews: PreviewProvider {
  static var previews: some View {
    WebRTCView()
  }
}
