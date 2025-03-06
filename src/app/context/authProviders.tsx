'use client'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </NextThemesProvider>
      </Provider>
    </SessionProvider>
  )
}