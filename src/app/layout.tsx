"use client";
import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";
import StyledComponentsRegistry from "@/libs/registry";
import { Provider } from "react-redux";
import { useRef } from "react";
import { AppStore, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useSocketConnection } from "@/hooks/useSocketConnection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = store();
  }

  const pathname = usePathname();
  const isHeader = !(
    pathname === "/login" ||
    pathname.includes("/join") ||
    pathname.includes("/password")
  );

  /* 소켓 연결 */
  useSocketConnection();

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <div id="modal-root"></div>
          <GlobalStyles />
          <ThemeProvider theme={theme}>
            <Provider store={storeRef.current}>
              {isHeader && <Header />}
              {children}
            </Provider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

