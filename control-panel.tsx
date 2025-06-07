"use client"

import { useState, useEffect } from "react"
import { Copy, X, Scan, Palette, Play, AlertTriangle, CheckCircle, Settings, Home, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type PanelState = "idle" | "printing" | "scanning" | "error" | "maintenance"
type ErrorType = "paper_jam" | "low_ink" | "door_open" | null

export default function Component() {
  const [currentState, setCurrentState] = useState<PanelState>("idle")
  const [errorType, setErrorType] = useState<ErrorType>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [progress, setProgress] = useState(0)

  // Simulate error animation steps
  useEffect(() => {
    if (errorType === "paper_jam") {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 3)
      }, 1500)
      return () => clearInterval(interval)
    }
  }, [errorType])

  // Simulate progress for printing/scanning
  useEffect(() => {
    if (currentState === "printing" || currentState === "scanning") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentState("idle")
            return 0
          }
          return prev + 2
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [currentState])

  const handleButtonPress = (action: string) => {
    switch (action) {
      case "copy":
        setCurrentState("printing")
        setProgress(0)
        break
      case "scan":
        setCurrentState("scanning")
        setProgress(0)
        break
      case "print_color":
        setCurrentState("printing")
        setProgress(0)
        break
      case "cancel":
        setCurrentState("idle")
        setProgress(0)
        setErrorType(null)
        break
      case "resume":
        if (errorType) {
          setErrorType(null)
          setCurrentState("printing")
        }
        break
      case "simulate_error":
        setCurrentState("error")
        setErrorType("paper_jam")
        break
      case "home":
        setCurrentState("idle")
        setErrorType(null)
        setProgress(0)
        break
      case "print":
        setCurrentState("printing")
        setProgress(0)
        break
    }
  }

  const handleTestError = () => {
    setCurrentState("error")
    setErrorType("paper_jam")
  }

  const getScreenContent = () => {
    if (currentState === "error" && errorType) {
      return (
        <div className="h-full flex flex-col justify-between p-4 bg-red-50">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Error Detected</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {errorType === "paper_jam" && (
              <div className="text-center">
                <div className="text-sm font-medium text-red-800 mb-3">Paper jam in rear tray</div>
                <div className="text-xs text-red-600 mb-4">Open rear door and remove jammed paper</div>

                {/* Animated guidance */}
                <div className="relative h-16 bg-white rounded border-2 border-red-200 mb-3">
                  <div className="absolute inset-2 bg-gray-100 rounded">
                    <div
                      className={`absolute top-1 left-2 w-8 h-1 bg-red-400 rounded transition-all duration-500 ${
                        animationStep === 0
                          ? "opacity-100"
                          : animationStep === 1
                            ? "opacity-50 translate-x-2"
                            : "opacity-0 translate-x-4"
                      }`}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {animationStep === 0
                        ? "1. Locate paper"
                        : animationStep === 1
                          ? "2. Gently pull"
                          : "3. Remove completely"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="text-xs text-red-600 text-center">Press RESUME when resolved</div>
        </div>
      )
    }

    if (currentState === "printing") {
      return (
        <div className="h-full flex flex-col justify-between p-4 bg-blue-50">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="font-semibold">Printing...</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-800">{progress}%</div>
              <div className="text-sm text-blue-600">Page 1 of 3</div>
            </div>

            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-blue-600 text-center">Press CANCEL to stop</div>
        </div>
      )
    }

    if (currentState === "scanning") {
      return (
        <div className="h-full flex flex-col justify-between p-4 bg-green-50">
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold">Scanning...</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-green-800">{progress}%</div>
              <div className="text-sm text-green-600">300 DPI Color</div>
            </div>

            <div className="relative h-8 bg-white border-2 border-green-200 rounded overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1 h-full bg-green-400 transition-all duration-100"
                style={{ transform: `translateX(${progress * 1.2}px)` }}
              />
            </div>
          </div>

          <div className="text-xs text-green-600 text-center">Keep document still</div>
        </div>
      )
    }

    // Idle state
    return (
      <div className="h-full flex flex-col justify-between p-4 bg-gray-50">
        <div className="flex items-center gap-2 text-gray-700">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="font-semibold">Ready</span>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="text-lg font-medium text-gray-800 mb-2">HP LaserJet Pro</div>
        </div>
      </div>
    )
  }

  const getContextualButtons = () => {
    if (currentState === "error") {
      return [
        { id: "resume", label: "Resume", icon: Play, variant: "default" as const },
        { id: "cancel", label: "Cancel", icon: X, variant: "outline" as const },
      ]
    }

    if (currentState === "printing" || currentState === "scanning") {
      return [{ id: "cancel", label: "Cancel", icon: X, variant: "destructive" as const }]
    }

    return [
      { id: "copy", label: "Copy", icon: Copy, variant: "default" as const },
      { id: "scan", label: "Scan", icon: Scan, variant: "default" as const },
      { id: "print", label: "Print", icon: Printer, variant: "default" as const },
      { id: "print_color", label: "Print Color", icon: Palette, variant: "default" as const },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="flex items-center gap-8">
        {/* Main Control Panel */}
        <Card className="bg-gray-800 p-6 pb-2 rounded-2xl shadow-2xl">
          <div className="flex gap-6">
            {/* LCD Screen */}
            <div className="relative">
              <div className="w-80 h-96 bg-black rounded-lg p-1 shadow-inner">
                <div className="w-full h-full bg-gray-900 rounded border border-gray-700 overflow-hidden">
                  {getScreenContent()}
                </div>
              </div>

              {/* Screen backlight effect */}
              <div className="absolute inset-0 bg-blue-400 opacity-5 rounded-lg pointer-events-none" />
            </div>

            {/* Control Buttons */}
            <div className="flex flex-col gap-3 w-32">
              {/* Main action buttons - Fixed height container */}
              <div className="h-52 flex flex-col justify-start space-y-2">
                {getContextualButtons().map((button) => {
                  const Icon = button.icon
                  return (
                    <Button
                      key={button.id}
                      variant={button.variant}
                      size="lg"
                      className="w-32 h-12 flex flex-col gap-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 border-gray-600 text-white shadow-lg"
                      onClick={() => handleButtonPress(button.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {button.label}
                    </Button>
                  )
                })}
              </div>

              {/* Separator */}
              <div className="h-px bg-gray-600 my-2" />

              {/* Utility buttons - Fixed height */}
              <div className="h-28 space-y-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-32 h-12 flex flex-col gap-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                  onClick={() => handleButtonPress("home")}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </div>
            </div>
          </div>

          {/* Status LED */}
          <div className="flex justify-center mt-1">
            <div
              className={`w-3 h-3 rounded-full ${
                currentState === "error"
                  ? "bg-red-500"
                  : currentState === "printing" || currentState === "scanning"
                    ? "bg-blue-500 animate-pulse"
                    : "bg-green-500"
              }`}
            />
          </div>
        </Card>

        {/* External Test Button */}
        <div className="flex flex-col items-center">
          <Button
            onClick={handleTestError}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center"
          >
            <Settings className="w-6 h-6" />
          </Button>
          <div className="mt-2 text-center">
            <div className="text-black text-xs text-center max-w-20">
              <div className="font-medium">TEST</div>
              <div className="text-gray-800">Error Button</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
