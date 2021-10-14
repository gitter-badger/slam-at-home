/*
 * Copyright 2021 Shingo OKAWA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import Document from "next/document";
import * as NextDocument from "next/document";

export default class SLAMDocument extends Document {
  static async getInitialProps(
    ctx: NextDocument.DocumentContext
  ): Promise<NextDocument.DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [...React.Children.toArray(initialProps.styles)],
    };
  }

  render(): React.ReactElement {
    return (
      <NextDocument.Html lang="en">
        <NextDocument.Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </NextDocument.Head>
        <body>
          <NextDocument.Main />
          <NextDocument.NextScript />
        </body>
      </NextDocument.Html>
    );
  }
}