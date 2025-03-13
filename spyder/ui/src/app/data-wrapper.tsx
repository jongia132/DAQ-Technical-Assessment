"use client"

import { createContext, useEffect, useState } from "react";
import { VehicleData } from "./page";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://localhost:8080"

export const dataContext = createContext<{ data: VehicleData | null, readyState: ReadyState }>({data: {battery_temperature: 0, timestamp: 0}, readyState: ReadyState.UNINSTANTIATED})

export default function DataProvider({ children }: { children?: React.ReactNode }) {
	const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null, readyState: ReadyState } = useWebSocket(
		WS_URL,
		{
			share: false,
			shouldReconnect: () => true,
		},
	)
	const [data, setData] = useState<VehicleData | null>(null)

	/**
 	* Effect hook to handle incoming WebSocket messages.
 	*/
	useEffect(() => {
		if (lastJsonMessage !== null) {
			setData(lastJsonMessage)
		}
	}, [lastJsonMessage])

	return (
		<dataContext.Provider value={{data, readyState }}>
			{children}
		</dataContext.Provider>
	)
}
