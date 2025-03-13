"use client"

import { useState, useEffect } from "react"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer } from "lucide-react"
import Numeric from "../components/custom/numeric"
import RedbackLogoDarkMode from "../../public/logo-darkmode.svg"
import RedbackLogoLightMode from "../../public/logo-lightmode.svg"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Chart } from "@/components/custom/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const WS_URL = "ws://localhost:8080"

export interface VehicleData {
  battery_temperature: number
  timestamp: number
}

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Page component that displays DAQ technical assessment. Contains the LiveValue component as well as page header and labels.
 * Could this be split into more components?...
 *
 * @returns {JSX.Element} The rendered page component.
 */
export default function Page(): JSX.Element {
  const [temperature, setTemperature] = useState<number>(0)
  const [history, setHistory] = useState<VehicleData[]>([])
  const [logs, setLogs] = useState<{ data: string, time: string }[]>([])
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected")
  const { lastJsonMessage, readyState }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  )

  /**
   * Effect hook to handle WebSocket connection state changes.
   */
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [readyState])

  /**
   * Effect hook to handle incoming WebSocket messages.
   */
  useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }

    setTemperature(lastJsonMessage.battery_temperature)

    const temp = history.slice(-9)
    temp.push(lastJsonMessage)
    setHistory(temp)

    if (lastJsonMessage.battery_temperature < 20 || lastJsonMessage.battery_temperature > 80) {
      logs.push({ data: "Battery Temperature unsafe", time: new Date(lastJsonMessage.timestamp).toLocaleTimeString("en-AU") })
      setLogs(logs)
    } else if (lastJsonMessage.battery_temperature <= 25 || lastJsonMessage.battery_temperature >= 75) {
      logs.push({ data: "Battery Temperature warning", time: new Date(lastJsonMessage.timestamp).toLocaleTimeString("en-AU") })
      setLogs(logs)
    }
  }, [lastJsonMessage])

  /**
   * Effect hook to swap the theme logo.
   */
  const [logo, setLogo] = useState(RedbackLogoDarkMode)
  const theme = useTheme().theme

  useEffect(() => {
    if (theme === 'light') {
      setLogo(RedbackLogoLightMode)
    } else {
      setLogo(RedbackLogoDarkMode)
    }
  }, [useTheme()])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-5 h-20 flex items-center gap-5 border-b">
        <Image
          src={logo}
          className="h-12 w-auto"
          alt="Redback Racing Logo"
        />
        <h1 className="text-foreground text-xl font-semibold">DAQ Technical Assessment</h1>
        <ModeToggle />
        <Badge variant={connectionStatus === "Connected" ? "success" : "destructive"} className="ml-auto">
          {connectionStatus}
        </Badge>
      </header>
      <main className="flex-grow flex items-center justify-center p-8 gap-8 flex-wrap">
        <div className="flex flex-col gap-8 w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-light flex items-center gap-2">
                <Thermometer className="h-6 w-6" />
                Live Battery Temperature
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Numeric temp={temperature.toFixed(3)} />
            </CardContent>
          </Card>
          <Chart data={history} />
        </div>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              Logs
            </CardTitle>
            <CardContent className="p-0 overflow-auto max-h-[450px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.toReversed().map((content, key) =>
                    <TableRow key={key}>
                      <TableCell>{content.data}</TableCell>
                      <TableCell>{content.time}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </CardHeader>
        </Card>
      </main>
    </div>
  )
}
