"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Play, Pause, Loader2 } from "lucide-react"

export default function TTSInterface() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  const handleConvert = async () => {
    if (!text.trim() || wordCount > 35) return

    setIsLoading(true)

    // Simulate API call to your backend
    try {
      // Replace this with your actual API endpoint
      // const response = await fetch('/api/tts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text })
      // })
      // const audioBlob = await response.blob()
      // const url = URL.createObjectURL(audioBlob)

      // For demo purposes, using a placeholder
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setAudioUrl("/placeholder-audio.wav") // Replace with actual audio URL
    } catch (error) {
      console.error("Error converting text to speech:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl])

  // Generate waveform bars for visualization
  const generateWaveform = () => {
    const bars = []
    const barCount = 40
    for (let i = 0; i < barCount; i++) {
      const height = Math.random() * 20 + 4
      const isActive = audioUrl && (currentTime / duration) * barCount > i
      bars.push(
        <div
          key={i}
          className={`w-1 rounded-full transition-colors duration-150 ${isActive ? "bg-blue-500" : "bg-gray-300"}`}
          style={{ height: `${height}px` }}
        />,
      )
    }
    return bars
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-8">
        {/* Text Input */}
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Conversia Text-Vorbire Utilizand Retele Neuronale</h1>
            <p className="text-gray-600">Introduceti text in Limba Romana(maxim 35 de cuvinte)</p>
          </div>

          <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm max-w-2xl mx-auto">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Introduceți textul în română aici..."
              className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-400 transition-colors resize-none"
              maxLength={200}
            />
            <div className="flex justify-between items-center mt-3">
              <span className={`text-sm ${wordCount > 35 ? "text-red-500" : "text-gray-500"}`}>
                {wordCount}/35 words
              </span>
              {wordCount > 35 && <span className="text-red-500 text-sm">Text exceeds 35 words limit</span>}
            </div>
          </Card>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleConvert}
            disabled={!text.trim() || wordCount > 35 || isLoading}
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            Convert to Audio
          </Button>
        </div>

        {/* Loading/Audio Player - Below Button */}
        <div className="flex justify-center">
          {isLoading && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="text-gray-600 font-medium">Processing audio...</span>
              </div>
            </Card>
          )}

          {audioUrl && !isLoading && (
            <Card className="p-4 bg-white/90 backdrop-blur-sm shadow-lg border-0 rounded-full">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={togglePlayPause}
                  size="icon"
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <div className="flex items-center space-x-1 px-2">{generateWaveform()}</div>

                <span className="text-sm font-medium text-gray-600 min-w-[35px]">{formatTime(duration)}</span>
              </div>

              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
