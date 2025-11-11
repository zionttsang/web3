"use client"

import { anvil, zksync } from "wagmi/chains"
import { getDefaultConfig } from "@rainbow-me/rainbowkit"

export default getDefaultConfig({
  appName: "TSender",
  projectId: null,
  chains: [anvil, zksync],
  ssr: false
}
)
